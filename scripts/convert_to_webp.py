import os
from PIL import Image

def convert_images_to_webp(directory, quality=80):
    """
    Converts all JPEG/PNG images in a directory to WebP format.
    """
    for filename in os.listdir(directory):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            path = os.path.join(directory, filename)
            img = Image.open(path)
            
            # Create new filename
            base = os.path.splitext(filename)[0]
            new_path = os.path.join(directory, f"{base}.webp")
            
            # Save as webp
            img.save(new_path, "WEBP", quality=quality)
            print(f"Converted {filename} to {base}.webp")

if __name__ == "__main__":
    # Example usage
    # convert_images_to_webp("../frames")
    pass
