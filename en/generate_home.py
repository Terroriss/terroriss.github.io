import os
import re
import json

current_directory = os.getcwd()

folders = []

vi_file_content = \
'''---
title: ""
date: 2021-09-15T20:28:41+07:00
layout: homepage
url: ""
languageCode: "vi"
---
'''

en_file_content = \
'''
---
title: ""
date: 2021-09-15T20:28:41+07:00
layout: homepage
url: ""
languageCode: "en"
---
'''

en_dicts = []
vi_dicts = []

en_articles = []
vi_articles = []

for file_or_folder_name in os.listdir(current_directory):
    if os.path.isdir(os.path.join(current_directory, file_or_folder_name)):
        folders.append(file_or_folder_name)

for path in folders:
    # Check if the _index.vi.md file exists in the folder
    vi_index_path = os.path.join(path, "_index.vi.md")
    vi_index_exists = os.path.isfile(vi_index_path)

    # Check if the _index.en.md file exists in the folder
    en_index_path = os.path.join(path, "_index.en.md")
    en_index_exists = os.path.isfile(en_index_path)

    vi_count = 0
    en_count = 0
    for dir_name, subdirs, files in os.walk(path):
        # check if there is an _index.*.md file in the current directory
        index_file_pattern = re.compile(r"_index\..+\.md$")
        if any(index_file_pattern.match(file) for file in files):
            vi_path = os.path.join(dir_name, "_index.vi.md")
            en_path = os.path.join(dir_name, "_index.en.md")
            if os.path.isfile(vi_path):
                with open(vi_path, "r") as index_file:
                    index_file_content = index_file.read()
                    # check if the draft property is set to true in the index file
                    if "draft: true" in index_file_content:
                        continue
                vi_count += 1
            if os.path.isfile(en_path):
                with open(en_path, "r") as index_file:
                    index_file_content = index_file.read()
                    # check if the draft property is set to true in the index file
                    if "draft: true" in index_file_content:
                        continue
                en_count += 1
    vi_card_nums = vi_count - 1 if vi_count < 10 else 9
    en_card_nums = en_count - 1 if en_count < 10 else 9
    if en_index_exists:
        count_text = f"{en_count} article" if en_count < 2 else f"{en_count} articles" if en_count < 11 else "10+ articles"
        color = ""
        title = ""
        draft = False
        tags = []
        with open(en_index_path, 'r') as file:
            for line in file:
                if "title:" in line:
                    value = line.split(":")[1].strip()
                    title = value.replace('"', '')
                if "mycolor:" in line:
                    value = line.split(":")[1].strip()
                    color = value
                if "draft:" in line and 'true' in line:
                    draft = True
                if "tags:" in line:
                    start = line.find('[')
                    end = line.find(']')
                    tags = line[start+1:end].replace("'", "").split(", ")
        en_articles.append(path)
        index = len(en_articles)
        if draft == False:
            en_dicts.append({
                "index": index,
                "title": title,
                "tags": tags
            })
            child_cards = '<div class="child"></div>' * vi_card_nums
            en_file_content += \
f'''
<div class="article-block" data-index="{index}">    
    <a href="{path}/">
        <div class="card {color}-series" style="--cards:{vi_count};">
            <div class="child">
                <h2>{title}</h2>
                <p>{count_text}</p>
            </div>
            {child_cards}
        </div>
    </a>
    <p class="tag"></p>
</div>
'''

    if vi_index_exists:
        count_text = f"{vi_count} bài viết" if vi_count < 11 else "10+ bài viết"
        color = ""
        title = ""
        draft = False
        tags = []
        with open(vi_index_path, 'r') as file:
            for line in file:
                if "title:" in line:
                    value = line.split(":")[1].strip()
                    title = value.replace('"', '')
                if "mycolor:" in line:
                    value = line.split(":")[1].strip()
                    color = value
                if "draft:" in line and 'true' in line:
                    draft = True
                if "tags:" in line:
                    start = line.find('[')
                    end = line.find(']')
                    tags = line[start+1:end].replace("'", "").split(", ")
        vi_articles.append(path)
        index = len(vi_articles)
        if draft == False:
            vi_dicts.append({
                "index": index,
                "title": title,
                "tags": tags
            })
            child_cards = '<div class="child"></div>' * vi_card_nums
            vi_file_content += \
f'''
<div class="article-block" data-index="{index}">    
    <a href="{path}/">
        <div class="card {color}-series" style="--cards:{vi_count};">
            <div class="child">
                <h2>{title}</h2>
                <p>{count_text}</p>
            </div>
            {child_cards}
        </div>
    </a>
    <p class="tag"></p>
</div>
'''

if len(vi_articles) == 0:
    vi_file_content += "Không có bài viết."

if len(en_articles) == 0:
    en_file_content += "No Articles."

with open("_index.vi.html", "w") as f:
    f.write(vi_file_content)

with open("_index.en.html", "w") as f:
    f.write(en_file_content)

vi_json = json.dumps(vi_dicts, ensure_ascii=False)
en_json = json.dumps(en_dicts, ensure_ascii=False)

with open("../static/js/en-pages.js", "w") as f:
    f.write("const pagesIndex = " + en_json)

with open("../static/js/vi-pages.js", "w") as f:
    f.write("const pagesIndex = " + vi_json)

import requests

comment_widget_url = "https://user.minhlong.site/widget/comment/index.html"

r = requests.get(comment_widget_url)

comment_widget_html = r.text

comment_widget = ""
for line in comment_widget_html.split('\n'):
    # Find the type and attributes of the element
    match = re.search(r'<script|<link', line)
    if match:
        comment_widget += line + "\n"

comment_widget = re.sub(r'(href|src)="(?!https?:\/\/)', r'\1="https://user.minhlong.site', comment_widget)
comment_widget = comment_widget.replace('crossorigin', 'crossorigin="anonymous"')

# Write the JSON to a file
with open("../layouts/partials/custom-comments.html", "w") as f:
    f.write(comment_widget)
    f.write('<div id="widget-comment-root"></div>')