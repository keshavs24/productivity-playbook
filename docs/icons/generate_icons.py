#!/usr/bin/env python3
"""
Generate PWA icon PNGs using only Python standard library.
Produces a gold lightning bolt on a dark charcoal background.
"""

import struct
import zlib
import math
import os

def create_png(width, height, pixels):
    """Create a PNG file from raw RGBA pixel data."""

    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack('>I', len(data)) + c + crc

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = chunk(b'IHDR', ihdr_data)

    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            idx = (y * width + x) * 4
            raw_data += bytes(pixels[idx:idx + 4])

    compressed = zlib.compress(raw_data, 9)
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')

    return signature + ihdr + idat + iend


def draw_filled_polygon(pixels, width, height, points, color):
    """Fill a polygon using scanline algorithm."""
    min_y = max(0, int(min(p[1] for p in points)))
    max_y = min(height - 1, int(max(p[1] for p in points)))

    for y in range(min_y, max_y + 1):
        intersections = []
        n = len(points)
        for i in range(n):
            x1, y1 = points[i]
            x2, y2 = points[(i + 1) % n]
            if y1 == y2:
                continue
            if y < min(y1, y2) or y >= max(y1, y2):
                continue
            x_intersect = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            intersections.append(x_intersect)

        intersections.sort()
        for i in range(0, len(intersections) - 1, 2):
            x_start = max(0, int(math.floor(intersections[i])))
            x_end = min(width - 1, int(math.ceil(intersections[i + 1])))
            for x in range(x_start, x_end + 1):
                idx = (y * width + x) * 4
                pixels[idx] = color[0]
                pixels[idx + 1] = color[1]
                pixels[idx + 2] = color[2]
                pixels[idx + 3] = color[3]


def draw_rounded_rect(pixels, width, height, x1, y1, x2, y2, radius, color):
    """Draw a filled rounded rectangle."""
    for y in range(y1, y2):
        for x in range(x1, x2):
            in_corner = False
            corner_inside = True

            if x < x1 + radius and y < y1 + radius:
                in_corner = True
                dx = x - (x1 + radius)
                dy = y - (y1 + radius)
                if dx * dx + dy * dy > radius * radius:
                    corner_inside = False
            elif x >= x2 - radius and y < y1 + radius:
                in_corner = True
                dx = x - (x2 - radius - 1)
                dy = y - (y1 + radius)
                if dx * dx + dy * dy > radius * radius:
                    corner_inside = False
            elif x < x1 + radius and y >= y2 - radius:
                in_corner = True
                dx = x - (x1 + radius)
                dy = y - (y2 - radius - 1)
                if dx * dx + dy * dy > radius * radius:
                    corner_inside = False
            elif x >= x2 - radius and y >= y2 - radius:
                in_corner = True
                dx = x - (x2 - radius - 1)
                dy = y - (y2 - radius - 1)
                if dx * dx + dy * dy > radius * radius:
                    corner_inside = False

            if not in_corner or corner_inside:
                idx = (y * width + x) * 4
                pixels[idx] = color[0]
                pixels[idx + 1] = color[1]
                pixels[idx + 2] = color[2]
                pixels[idx + 3] = color[3]


def generate_icon(size, filepath):
    """Generate a single icon at the given size."""
    pixels = [0] * (size * size * 4)

    bg_color = (0x1C, 0x19, 0x17, 0xFF)
    bolt_color = (0xD4, 0xA5, 0x74, 0xFF)

    corner_radius = int(size * 0.18)

    draw_rounded_rect(pixels, size, size, 0, 0, size, size, corner_radius, bg_color)

    s = size
    bolt_points = [
        (0.52 * s, 0.12 * s),
        (0.30 * s, 0.50 * s),
        (0.46 * s, 0.50 * s),
        (0.36 * s, 0.88 * s),
        (0.70 * s, 0.42 * s),
        (0.54 * s, 0.42 * s),
    ]

    draw_filled_polygon(pixels, size, size, bolt_points, bolt_color)

    png_data = create_png(size, size, pixels)

    with open(filepath, 'wb') as f:
        f.write(png_data)

    file_size = os.path.getsize(filepath)
    print(f"  Created: {filepath} ({size}x{size}, {file_size:,} bytes)")


def main():
    icons_dir = os.path.dirname(os.path.abspath(__file__))

    print("Generating PWA icons...")
    print(f"  Output directory: {icons_dir}")
    print()

    icons = [
        (192, os.path.join(icons_dir, "icon-192.png")),
        (512, os.path.join(icons_dir, "icon-512.png")),
        (180, os.path.join(icons_dir, "apple-touch-icon-180.png")),
    ]

    for size, filepath in icons:
        generate_icon(size, filepath)

    print()
    print("All icons generated successfully.")


if __name__ == "__main__":
    main()
