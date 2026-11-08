import math
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, is_maskable=False):
    scale = 2
    dim = size * scale
    img = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Padding
    if is_maskable:
        padding = dim * 0.1
        draw.rectangle([0, 0, dim, dim], fill=(30, 58, 138, 255))
    else:
        padding = 0 if size <= 48 else dim * 0.04
        radius = int(dim * 0.22)
        draw.rounded_rectangle([padding, padding, dim - padding, dim - padding], radius=radius, fill=(30, 58, 138, 255))
        if size > 64:
            inner_pad = padding + dim * 0.03
            draw.rounded_rectangle([inner_pad, inner_pad, dim - inner_pad, dim - inner_pad], radius=int(radius * 0.85), outline=(56, 189, 248, 80), width=max(1, int(3 * scale)))

    center_x = dim / 2.0
    center_y = dim * 0.44 if (size >= 128 and not is_maskable) else dim / 2.0

    s_width = dim * 0.56
    s_height = dim * 0.34

    left = int(center_x - s_width / 2.0)
    right = int(center_x + s_width / 2.0)
    top = int(center_y - s_height / 2.0)

    # 1. Top bread slice
    bread_top_h = int(s_height * 0.32)
    b_rad = max(2, int(bread_top_h * 0.35))
    draw.rounded_rectangle([left, top, right, top + bread_top_h], radius=b_rad, fill=(245, 158, 11, 255), outline=(217, 119, 6, 255), width=max(1, int(2 * scale)))

    # 2. Lettuce layer (Green)
    let_top = top + int(bread_top_h * 0.75)
    let_h = max(4, int(s_height * 0.20))
    l_rad = max(2, int(let_h * 0.3))
    draw.rounded_rectangle([left - int(dim * 0.02), let_top, right + int(dim * 0.02), let_top + let_h], radius=l_rad, fill=(34, 197, 94, 255))

    # 3. Ham layer (Red/Pink)
    ham_top = let_top + int(let_h * 0.6)
    ham_h = max(4, int(s_height * 0.18))
    h_rad = max(2, int(ham_h * 0.3))
    draw.rounded_rectangle([left + int(dim * 0.01), ham_top, right - int(dim * 0.01), ham_top + ham_h], radius=h_rad, fill=(244, 63, 94, 255))

    # 4. Cheese layer (Yellow point)
    ch_top = ham_top + int(ham_h * 0.6)
    ch_h = max(4, int(s_height * 0.22))
    points = [
        (left + int(dim * 0.03), ch_top),
        (right - int(dim * 0.03), ch_top),
        (right - int(dim * 0.08), ch_top + ch_h),
        (center_x + int(dim * 0.08), ch_top + int(ch_h * 0.4)),
        (center_x, ch_top + ch_h + int(dim * 0.02)),
        (center_x - int(dim * 0.10), ch_top + int(ch_h * 0.4)),
        (left + int(dim * 0.05), ch_top + ch_h)
    ]
    draw.polygon(points, fill=(251, 191, 36, 255))

    # 5. Bottom bread slice
    bot_top = ch_top + int(ch_h * 0.4)
    bot_h = int(s_height * 0.30)
    bot_rad = max(2, int(bot_h * 0.35))
    draw.rounded_rectangle([left, bot_top, right, bot_top + bot_h], radius=bot_rad, fill=(217, 119, 6, 255), outline=(180, 83, 9, 255), width=max(1, int(2 * scale)))

    # PW Badge
    if size >= 128:
        badge_r = int(dim * 0.09)
        bx = int(right + dim * 0.01)
        by = int(top + dim * 0.01)
        draw.ellipse([bx - badge_r, by - badge_r, bx + badge_r, by + badge_r], fill=(59, 130, 246, 255), outline=(255, 255, 255, 255), width=max(1, int(2 * scale)))
        try:
            font = ImageFont.truetype("arialbd.ttf", int(badge_r * 0.95))
            draw.text((bx, by), "PW", fill=(255, 255, 255, 255), font=font, anchor="mm")
        except:
            pass

    # "PANWICH" text below
    if size >= 256 and not is_maskable:
        text_y = int(dim * 0.77)
        try:
            font = ImageFont.truetype("arialbd.ttf", int(dim * 0.085))
            draw.text((center_x, text_y), "PANWICH", fill=(248, 250, 252, 255), font=font, anchor="mm")
            sub_font = ImageFont.truetype("arialbd.ttf", int(dim * 0.038))
            draw.text((center_x, text_y + int(dim * 0.07)), "ORDER POS", fill=(56, 189, 248, 255), font=sub_font, anchor="mm")
        except:
            pass

    return img.resize((size, size), Image.Resampling.LANCZOS)

if __name__ == '__main__':
    # 512x512
    pwa512 = create_icon(512, is_maskable=False)
    pwa512.save('public/pwa-512x512.png')

    # Maskable 512x512
    maskable = create_icon(512, is_maskable=True)
    maskable.save('public/pwa-maskable-512x512.png')

    # 192x192
    pwa192 = create_icon(192, is_maskable=False)
    pwa192.save('public/pwa-192x192.png')

    # 180x180 Apple touch icon
    apple = create_icon(180, is_maskable=False)
    apple.save('public/apple-touch-icon.png')

    # 64x64 & 32x32 for favicon.ico
    ico32 = create_icon(32, is_maskable=False)
    ico32.save('public/favicon.ico', sizes=[(32, 32), (64, 64)])

    print("All PWA icons generated successfully!")
