#!/usr/bin/env python3
"""Generate PNG icons and screenshots for PWA with correct dimensions"""

import struct
import zlib
import os

def create_png(width, height, color_r=0, color_g=255, color_b=255):
    """Create a valid PNG file with specified dimensions and color"""
    
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk (Image header)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (Image data)
    # Create scanlines: each scanline = 1 filter byte (0=None) + RGB bytes per pixel
    scanlines = b''
    for y in range(height):
        scanline = b'\x00'  # Filter type: None
        for x in range(width):
            # Create subtle gradient pattern with AI branding colors
            r = int((x / width) * 255) if color_r == 0 else color_r
            g = int((y / height) * 255) if color_g == 255 else color_g
            b = 255 - int((x / width) * 255) if color_b == 255 else color_b
            scanline += bytes([r, g, b])
        scanlines += scanline
    
    idat_data = zlib.compress(scanlines)
    idat_crc = zlib.crc32(b'IDAT' + idat_data) & 0xffffffff
    idat_chunk = struct.pack('>I', len(idat_data)) + b'IDAT' + idat_data + struct.pack('>I', idat_crc)
    
    # IEND chunk (End)
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    try:
        # Generate 192x192 PNG icon
        print('Generating icon-192.png (192x192)...')
        icon_192 = create_png(192, 192, color_r=0, color_g=255, color_b=255)
        icon_192_path = os.path.join(script_dir, 'icon-192.png')
        with open(icon_192_path, 'wb') as f:
            f.write(icon_192)
        print(f'✅ Created icon-192.png ({len(icon_192)} bytes)')
        
        # Generate 512x512 PNG icon
        print('Generating icon-512.png (512x512)...')
        icon_512 = create_png(512, 512, color_r=0, color_g=255, color_b=255)
        icon_512_path = os.path.join(script_dir, 'icon-512.png')
        with open(icon_512_path, 'wb') as f:
            f.write(icon_512)
        print(f'✅ Created icon-512.png ({len(icon_512)} bytes)')
        
        # Generate 540x720 PNG screenshot (narrow/mobile)
        print('Generating screenshot-narrow.png (540x720)...')
        screenshot_narrow = create_png(540, 720, color_r=13, color_g=13, color_b=13)
        screenshot_narrow_path = os.path.join(script_dir, 'screenshot-narrow.png')
        with open(screenshot_narrow_path, 'wb') as f:
            f.write(screenshot_narrow)
        print(f'✅ Created screenshot-narrow.png ({len(screenshot_narrow)} bytes)')
        
        # Generate 1280x720 PNG screenshot (wide/desktop)
        print('Generating screenshot-wide.png (1280x720)...')
        screenshot_wide = create_png(1280, 720, color_r=13, color_g=13, color_b=13)
        screenshot_wide_path = os.path.join(script_dir, 'screenshot-wide.png')
        with open(screenshot_wide_path, 'wb') as f:
            f.write(screenshot_wide)
        print(f'✅ Created screenshot-wide.png ({len(screenshot_wide)} bytes)')
        
        print('\n✅ All PWA assets generated with correct dimensions!')
        print('📝 Icons and screenshots are now valid PNG files')
        print('\n🚀 Ready to deploy!')
        
        return True
        
    except Exception as e:
        print(f'❌ Error creating assets: {e}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    if not main():
        exit(1)
