import os
from typing import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END

# Определение структуры состояния
class LectureSummaryState(TypedDict):
    """Состояние для процесса суммаризации лекции."""
    lecture_text: str
    timing: str
    analysis_result: str
    summary_result: str
    markdown_result: str
    final_result: str

# Функция для разбиения текста на части
def chunk_text(text, max_chunk_size=16000):
    """Разбивает текст на управляемые фрагменты."""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_size = 0
    
    for paragraph in paragraphs:
        paragraph_size = len(paragraph)
        
        if current_size + paragraph_size > max_chunk_size and current_chunk:
            chunks.append('\n\n'.join(current_chunk))
            current_chunk = [paragraph]
            current_size = paragraph_size
        else:
            current_chunk.append(paragraph)
            current_size += paragraph_size + 2  # +2 for '\n\n'
    
    if current_chunk:
        chunks.append('\n\n'.join(current_chunk))
        
    return chunks

class LectureSummarizer:
    """Класс для суммаризации лекций с LangGraph."""
    
    def __init__(self):
        # Инициализация LLM с указанными параметрами
        self.llm = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL_NAME"),
            temperature=0,
            base_url=os.getenv("OPENAI_BASE_URL"),
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        
        # Создание графа
        self.graph = self._create_graph()
    
    def _analyze_lecture(self, state: LectureSummaryState) -> LectureSummaryState:
        """Анализирует текст лекции."""
        prompt = f"""
        ВАЖНО: Проанализируйте ТОЛЬКО предоставленный текст лекции.
        
        Текст лекции:
        ```
        {state['lecture_text']}
        ```
        
        Информация о временных метках: {state['timing']}
        
        Ваша задача:
        1. Определить основные темы и разделы ЭТОЙ лекции
        2. Извлечь ключевые определения и понятия из текста
        3. Определить, какие части подходят для таблиц
        4. Отметить все временные метки
        
        НЕ ДОБАВЛЯЙТЕ информацию, которой нет в тексте.
        """
        
        result = self.llm.invoke(prompt)
        state["analysis_result"] = result.content
        return state
    
    def _summarize_content(self, state: LectureSummaryState) -> LectureSummaryState:
        """Создает краткое изложение разделов."""
        prompt = f"""
        Создайте краткие изложения разделов лекции на основе анализа.
        
        Текст лекции:
        ```
        {state['lecture_text']}
        ```
        
        Результаты анализа:
        ```
        {state['analysis_result']}
        ```
        
        Временные метки: {state['timing']}
        
        Для каждого раздела создайте краткое изложение, сохраняя:
        1. Ключевое содержание
        2. Точные определения
        3. Оригинальную структуру
        4. Временные метки
        
        НЕ СОЗДАВАЙТЕ нового содержания.
        """
        
        result = self.llm.invoke(prompt)
        state["summary_result"] = result.content
        return state
    
    def _generate_markdown(self, state: LectureSummaryState) -> LectureSummaryState:
        """Создает Markdown-документ."""
        prompt = f"""
        Создайте Markdown-документ на основе суммированного содержания.
        
        Текст лекции:
        ```
        {state['lecture_text']}
        ```
        
        Краткие изложения:
        ```
        {state['summary_result']}
        ```
        
        Документ должен включать:
        1. Настоящее название лекции
        2. Оглавление с разделами и временными метками
        3. Отформатированные разделы с содержанием
        4. Таблицы, где необходимо
        
        Пример оглавления:
        ```markdown
        # Основные философские течения в современном обществе
        
        ## Оглавление
        1. [Традиционализм (0:21)](#традиционализм)
        2. [Умеренный прогрессивизм: национальная школа (1:37)](#умеренный-прогрессивизм-национальная-школа)
        3. [Умеренный прогрессивизм: глобальная школа (3:33)](#умеренный-прогрессивизм-глобальная-школа)
        4. [Революционные движения (5:04)](#революционные-движения)
        ```
        
        Верните ТОЛЬКО Markdown без комментариев.
        """
        
        result = self.llm.invoke(prompt)
        state["markdown_result"] = result.content
        state["final_result"] = result.content  # Для одной части они совпадают
        return state
    
    def _create_graph(self):
        """Создает граф обработки."""
        builder = StateGraph(LectureSummaryState)
        
        # Добавляем узлы
        builder.add_node("analyzer", self._analyze_lecture)
        builder.add_node("summarizer", self._summarize_content)
        builder.add_node("markdown_generator", self._generate_markdown)
        
        # Определяем последовательность
        builder.add_edge(START, "analyzer")
        builder.add_edge("analyzer", "summarizer")
        builder.add_edge("summarizer", "markdown_generator")
        builder.add_edge("markdown_generator", END)
        
        # Компилируем граф
        return builder.compile()
    
    def _merge_markdown_documents(self, markdown_parts):
        """Объединяет несколько Markdown-документов."""
        prompt = f"""
        Объедините эти Markdown-документы в один целостный документ:
        
        ```
        {markdown_parts}
        ```
        
        Обеспечьте:
        1. Единое оглавление со всеми разделами
        2. Последовательное содержание без повторов
        3. Согласованное форматирование
        4. Сохранение всех временных меток
        
        Верните ТОЛЬКО объединенный Markdown без комментариев.
        """
        
        return self.llm.invoke(prompt).content
    
    def process_lecture(self, lecture_data, max_chunk_size=16000):
        """Обрабатывает лекцию с учетом таймингов."""
        # Подготовка данных
        if isinstance(lecture_data, str):
            chunks = chunk_text(lecture_data, max_chunk_size)
            structured_chunks = [(chunk, None) for chunk in chunks]
        elif isinstance(lecture_data, dict):
            if 'chunks' in lecture_data and isinstance(lecture_data['chunks'], list):
                # Обработка формата {'chunks': [{'timestamp': [...], 'text': ...}]}
                structured_chunks = []
                for chunk in lecture_data['chunks']:
                    if 'timestamp' in chunk and 'text' in chunk:
                        # Если text - это словарь с timestamp и text внутри
                        if isinstance(chunk['text'], dict) and 'text' in chunk['text']:
                            structured_chunks.append((chunk['text']['text'], str(chunk['timestamp'])))
                        else:
                            structured_chunks.append((chunk['text'], str(chunk['timestamp'])))
            else:
                structured_chunks = list(lecture_data.items())
        elif isinstance(lecture_data, list) and all(isinstance(item, tuple) for item in lecture_data):
            structured_chunks = lecture_data
        elif isinstance(lecture_data, list) and all(isinstance(item, dict) for item in lecture_data):
            # Обработка списка словарей [{'timestamp': [...], 'text': ...}]
            structured_chunks = []
            for chunk in lecture_data:
                if 'timestamp' in chunk and 'text' in chunk:
                    structured_chunks.append((chunk['text'], str(chunk['timestamp'])))
        else:
            raise ValueError("Неверный формат данных лекции")
        # Если только одна часть
        if len(structured_chunks) == 1:
            text, timing = structured_chunks[0]
            state = {
                "lecture_text": text,
                "timing": timing if timing else "",
                "analysis_result": "",
                "summary_result": "",
                "markdown_result": "",
                "final_result": ""
            }
            
            result = self.graph.invoke(state)
            return result["final_result"]
        
        # Обработка нескольких частей
        print(f"Лекция разбита на {len(structured_chunks)} частей")
        markdown_parts = []
        
        for i, (text, timing) in enumerate(structured_chunks):
            print(f"Обработка части {i+1}/{len(structured_chunks)}...")
            
            state = {
                "lecture_text": text,
                "timing": timing if timing else "",
                "analysis_result": "",
                "summary_result": "",
                "markdown_result": "",
                "final_result": ""
            }
            
            try:
                result = self.graph.invoke(state)
                markdown_parts.append(result["markdown_result"])
                print(f"Часть {i+1} обработана успешно")
            except Exception as e:
                print(f"Ошибка при обработке части {i+1}: {e}")
        
        # Объединение результатов
        if len(markdown_parts) > 1:
            print("Объединение всех частей...")
            markdown_parts_text = "\n\n===DOCUMENT SEPARATOR===\n\n".join(markdown_parts)
            final_markdown = self._merge_markdown_documents(markdown_parts_text)
            return final_markdown
        elif len(markdown_parts) == 1:
            return markdown_parts[0]
        else:
            raise ValueError("Не удалось обработать ни одну часть лекции")

def summarize_lecture_with_timings(lecture_data, max_chunk_size=16000):
    """
    Создает структурированный Markdown-документ с конспектом лекции.
    
    Args:
        lecture_data: текст лекции (строка), словарь {текст: время} или список [(текст, время)]
        max_chunk_size: максимальный размер фрагмента для обработки (по умолчанию 16000)
        
    Returns:
        Markdown с суммаризацией лекции и таймингами
    """
    summarizer = LectureSummarizer()
    return summarizer.process_lecture(lecture_data, max_chunk_size=max_chunk_size)