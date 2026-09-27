import urllib.request, re, os
from collections import defaultdict

css_url = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&family=Italianno&family=JetBrains+Mono:wght@400&display=swap'
req = urllib.request.Request(css_url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
})
css = urllib.request.urlopen(req).read().decode('utf-8')

out = 'public/fonts'
os.makedirs(out, exist_ok=True)

# Parse @font-face blocks
blocks = re.split(r'@font-face\s*\{', css)
font_faces = []
for block in blocks[1:]:
    family = re.search(r"font-family:\s*'([^']+)'", block)
    style = re.search(r'font-style:\s*(\w+)', block)
    weight = re.search(r'font-weight:\s*(\d+)', block)
    url_match = re.search(r'url\(([^)]+)\)', block)
    unicode_range = re.search(r'unicode-range:\s*([^;]+)', block)
    if family and url_match:
        font_faces.append({
            'family': family.group(1),
            'style': style.group(1) if style else 'normal',
            'weight': weight.group(1) if weight else '400',
            'url': url_match.group(1),
            'unicode_range': unicode_range.group(1).strip() if unicode_range else None
        })

print(f'Parsed {len(font_faces)} @font-face blocks')

groups = defaultdict(list)
for f in font_faces:
    key = (f['family'], f['style'], f['weight'])
    groups[key].append(f)

css_out = '/* Auto-generated local font declarations - do not edit manually */\n'
file_map = {}

for key, faces in sorted(groups.items()):
    family, style, weight = key
    safe = family.replace(' ', '')
    if style == 'italic':
        suffix = 'Italic'
    elif weight == '500':
        suffix = 'Medium'
    else:
        suffix = 'Regular'
    
    base_name = f'{safe}-{suffix}'
    subset_urls = []
    
    for i, f in enumerate(faces):
        fname = f'{base_name}-{i}.woff2'
        path = os.path.join(out, fname)
        urllib.request.urlretrieve(f['url'], path)
        size = os.path.getsize(path)
        ur_display = f['unicode_range'][:50] if f['unicode_range'] else 'all'
        print(f'  OK {fname} ({size} bytes) range={ur_display}')
        subset_urls.append((fname, f['unicode_range']))
    
    file_map[(family, style, weight)] = subset_urls

for (family, style, weight), subsets in file_map.items():
    for fname, urange in subsets:
        css_out += f"\n@font-face {{\n"
        css_out += f"  font-family: '{family}';\n"
        css_out += f"  font-style: {style};\n"
        css_out += f"  font-weight: {weight};\n"
        css_out += f"  font-display: swap;\n"
        css_out += f"  src: url('/fonts/{fname}') format('woff2');\n"
        if urange:
            css_out += f"  unicode-range: {urange};\n"
        css_out += "}\n"

css_path = 'src/styles/fonts.css'
with open(css_path, 'w', encoding='utf-8') as fp:
    fp.write(css_out)

total = sum(len(v) for v in file_map.values())
print(f'\nWrote {css_path} ({len(css_out)} chars, {total} font files)')
