import json

with open('manifest.json', 'r') as f:
    data = json.load(f)

print('✅ manifest.json is valid JSON')
print(f'✅ App ID: {data.get("id")}')
print(f'✅ Start URL: {data.get("start_url")}')
print(f'✅ Icons: {len(data.get("icons", []))} entries')
print(f'✅ Screenshots: {len(data.get("screenshots", []))} entries')

print('\nIcon details:')
for icon in data.get('icons', []):
    print(f'  - {icon["sizes"]} ({icon.get("purpose", "any")})')

print('\nScreenshot details:')
for screenshot in data.get('screenshots', []):
    print(f'  - {screenshot["sizes"]} ({screenshot.get("form_factor", "unknown")})')
