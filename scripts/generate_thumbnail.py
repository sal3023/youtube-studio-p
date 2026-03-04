import os
from openai import OpenAI
from datetime import datetime
import glob

def generate_thumbnail_concept():
    api_key = os.getenv("OPENAI_API_KEY") # Still use OPENAI_API_KEY for compatibility
    base_url = os.getenv("LLM_API_BASE", "https://api.openai.com/v1")
    model_name = os.getenv("LLM_MODEL", "gpt-4.1-mini") # Default to gpt-4.1-mini if not specified

    client = OpenAI(api_key=api_key, base_url=base_url)

    # Find the latest generated script
    list_of_scripts = glob.glob("content/scripts/*.md")
    if not list_of_scripts:
        print("No scripts found. Please generate a script first.")
        return
    latest_script_file = max(list_of_scripts, key=os.path.getctime)

    with open(latest_script_file, "r", encoding="utf-8") as f:
        script_content = f.read()

    prompt = f"Based on the following YouTube video script, generate 3 distinct and engaging thumbnail concepts. For each concept, describe the visual elements, text overlay, and overall mood. Focus on attracting viewers for a health and fitness channel. Script: {script_content}"

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a creative YouTube thumbnail designer for a health and fitness channel."},
            {"role": "user", "content": prompt}
        ]
    )

    thumbnail_concepts = response.choices[0].message.content

    filename = f"content/thumbnails/thumbnail_concept_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(thumbnail_concepts)
    print(f"Generated thumbnail concepts saved to {filename}")

if __name__ == "__main__":
    generate_thumbnail_concept()
