import os
import subprocess
from PIL import Image

try:
    from imageio_ffmpeg import get_ffmpeg_exe
except ImportError:
    get_ffmpeg_exe = None

def convert_png_to_webp(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith('.png'):
                png_path = os.path.join(root, file)
                webp_path = os.path.splitext(png_path)[0] + '.webp'
                
                print(f"Converting: {png_path} -> {webp_path}")
                try:
                    with Image.open(png_path) as img:
                        img.save(webp_path, 'WEBP')
                    os.remove(png_path)
                except Exception as e:
                    print(f"Error converting {png_path}: {e}")

def convert_video_to_webm(root_dir):
    if get_ffmpeg_exe is None:
        print("imageio-ffmpeg is not installed. Skipping video conversion.")
        return
        
    ffmpeg_bin = get_ffmpeg_exe()
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(('.mp4', '.mov')):
                video_path = os.path.join(root, file)
                webm_path = os.path.splitext(video_path)[0] + '.webm'
                
                print(f"Converting: {video_path} -> {webm_path}")
                try:
                    cmd = [
                        ffmpeg_bin, "-y", "-i", video_path,
                        "-c:v", "libvpx-vp9",
                        "-crf", "30",
                        "-b:v", "0",
                        "-pix_fmt", "yuva420p",
                        "-cpu-used", "4",
                        "-row-mt", "1",
                        "-c:a", "libopus",
                        webm_path
                    ]
                    result = subprocess.run(cmd, capture_output=True, text=True)
                    if result.returncode == 0:
                        os.remove(video_path)
                    else:
                        print(f"Error converting {video_path}: {result.stderr}")
                except Exception as e:
                    print(f"Error converting {video_path}: {e}")

def update_references(root_dir):
    extensions = ('.html', '.css', '.js', '.md', '.json')
    for root, dirs, files in os.walk(root_dir):
        # Skip .git and other hidden dirs
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue
            
        for file in files:
            if file.lower().endswith(extensions):
                file_path = os.path.join(root, file)
                if file in ('convert_assets.py', 'png-to-webp.py', 'converter.py'):
                    continue
                
                print(f"Updating references in: {file_path}")
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Replace PNG references
                    new_content = content.replace('.png', '.webp').replace('.PNG', '.webp')
                    # Replace Video references (keep .mp4 format as requested)
                    new_content = new_content.replace('.mov', '.mp4').replace('.MOV', '.mp4')
                    # Fix accidental moveTo corruption from replacing '.mov' inside 'ctx.moveTo'
                    new_content = new_content.replace('.mp4eTo', '.moveTo').replace('.webmeTo', '.moveTo')
                    
                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    print(f"Error updating {file_path}: {e}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    print(f"Starting conversion in: {current_dir}")
    convert_png_to_webp(current_dir)
    convert_video_to_webm(current_dir)
    update_references(current_dir)
    print("Done!")
