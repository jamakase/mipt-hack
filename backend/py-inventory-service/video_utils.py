import os
import requests
import numpy as np
import librosa
import soundfile as sf
from moviepy.editor import VideoFileClip
from pydub import AudioSegment
from io import BytesIO
import validators

def extract_audio(source, output_path=None, format="wav"):
    """
    Extract audio from a URL or local file path (audio or video).
    
    Args:
        source (str): URL or file path of the audio or video file
        output_path (str, optional): Path to save the extracted audio. If None, audio is not saved to disk.
        format (str, optional): Format of the output audio file. Default is "wav".
        
    Returns:
        tuple: (audio_array, sample_rate) if output_path is None, otherwise the path to the saved audio file
    """
    # Check if source is a URL or a file path
    is_url = validators.url(source) or source.startswith(('http://', 'https://'))
    
    if is_url:
        return extract_audio_from_url(source, output_path, format)
    else:
        # Check if it's a video or audio file
        if source.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv')):
            return extract_audio_from_video(source, output_path, format)
        elif source.lower().endswith(('.mp3', '.wav', '.ogg', '.flac', '.aac')):
            return extract_audio_from_audio_file(source, output_path, format)
        else:
            raise ValueError(f"Unsupported file format: {source}")

def extract_audio_from_url(url, output_path=None, format="wav"):
    """
    Extract audio from a URL pointing to an audio or video file.
    
    Args:
        url (str): URL of the audio or video file
        output_path (str, optional): Path to save the extracted audio. If None, audio is not saved to disk.
        format (str, optional): Format of the output audio file. Default is "wav".
        
    Returns:
        tuple: (audio_array, sample_rate) if output_path is None, otherwise the path to the saved audio file
    """
    # Download the file
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        raise Exception(f"Failed to download file: {response.status_code}")
    
    content_type = response.headers.get('content-type', '')
    
    # Process based on content type
    if 'video' in content_type:
        # Handle video file
        temp_video_path = "temp_video.mp4"
        with open(temp_video_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        
        # Extract audio from video
        video = VideoFileClip(temp_video_path)
        audio = video.audio
        
        if output_path:
            audio.write_audiofile(output_path)
            video.close()
            os.remove(temp_video_path)
            return output_path
        else:
            temp_audio_path = "temp_audio.wav"
            audio.write_audiofile(temp_audio_path)
            audio_array, sample_rate = librosa.load(temp_audio_path, sr=None)
            video.close()
            os.remove(temp_video_path)
            os.remove(temp_audio_path)
            return audio_array, sample_rate
            
    elif 'audio' in content_type:
        # Handle audio file
        audio_data = BytesIO(response.content)
        
        try:
            # Try loading with librosa
            audio_array, sample_rate = librosa.load(audio_data, sr=None)
            
            if output_path:
                sf.write(output_path, audio_array, sample_rate)
                return output_path
            else:
                return audio_array, sample_rate
                
        except Exception:
            # Fallback to pydub
            audio = AudioSegment.from_file(audio_data)
            
            if output_path:
                audio.export(output_path, format=format)
                return output_path
            else:
                # Convert to numpy array
                samples = np.array(audio.get_array_of_samples())
                if audio.channels > 1:
                    samples = samples.reshape((-1, audio.channels))
                return samples, audio.frame_rate
    else:
        # Try to guess based on file extension
        file_ext = url.split('.')[-1].lower()
        if file_ext in ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv']:
            # Treat as video
            temp_video_path = f"temp_video.{file_ext}"
            with open(temp_video_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            
            return extract_audio_from_video(temp_video_path, output_path, format)
        else:
            # Try as audio
            try:
                audio_data = BytesIO(response.content)
                return extract_audio_from_audio_file(audio_data, output_path, format)
            except Exception as e:
                raise Exception(f"Could not process content: {e}")

def extract_audio_from_video(video_path, output_path=None, format="wav"):
    """
    Extract audio from a local video file.
    
    Args:
        video_path (str): Path to the video file
        output_path (str, optional): Path to save the extracted audio. If None, audio is not saved to disk.
        format (str, optional): Format of the output audio file. Default is "wav".
        
    Returns:
        tuple: (audio_array, sample_rate) if output_path is None, otherwise the path to the saved audio file
    """
    # Load video
    video = VideoFileClip(video_path)
    audio = video.audio
    
    if output_path:
        # Save audio to file
        audio.write_audiofile(output_path)
        video.close()
        return output_path
    else:
        # Return audio as numpy array
        temp_audio_path = "temp_audio.wav"
        audio.write_audiofile(temp_audio_path)
        audio_array, sample_rate = librosa.load(temp_audio_path, sr=None)
        video.close()
        os.remove(temp_audio_path)
        return audio_array, sample_rate

def extract_audio_from_audio_file(audio_path, output_path=None, format="wav"):
    """
    Process an audio file (either from a file path or a BytesIO object).
    
    Args:
        audio_path: Path to the audio file or BytesIO object
        output_path (str, optional): Path to save the processed audio. If None, audio is not saved to disk.
        format (str, optional): Format of the output audio file. Default is "wav".
        
    Returns:
        tuple: (audio_array, sample_rate) if output_path is None, otherwise the path to the saved audio file
    """
    try:
        # Try loading with librosa
        audio_array, sample_rate = librosa.load(audio_path, sr=None)
        
        if output_path:
            sf.write(output_path, audio_array, sample_rate)
            return output_path
        else:
            return audio_array, sample_rate
            
    except Exception:
        # Fallback to pydub
        audio = AudioSegment.from_file(audio_path)
        
        if output_path:
            audio.export(output_path, format=format)
            return output_path
        else:
            # Convert to numpy array
            samples = np.array(audio.get_array_of_samples())
            if audio.channels > 1:
                samples = samples.reshape((-1, audio.channels))
            return samples, audio.frame_rate
