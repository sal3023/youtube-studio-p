import os
from openai import OpenAI
from datetime import datetime
import glob

def generate_image_prompt():
    api_key = os.getenv("OPENAI_API_KEY") # Still use OPENAI_API_KEY for compatibility
    base_url = os.getenv("LLM_API_BASE", "https://api.openai.com/v1")
    model_name = os.getenv("LLM_MODEL", "gpt-4.1-mini") # Default to gpt-4.1-mini if not specified

    client = OpenAI(api_key=api_key, base_url=base_url)

    # Find the latest generated thumbnail concept
    list_of_concepts = glob.glob("content/thumbnails/thumbnail_concept_*.md")
    if not list_of_concepts:
        print("No thumbnail concepts found. Please generate concepts first.")
        return
    latest_concept_file = max(list_of_concepts, key=os.path.getctime)

    with open(latest_concept_file, "r", encoding="utf-8") as f:
        concept_content = f.read()

    prompt = f"Based on the following YouTube thumbnail concepts, generate 3 distinct and highly descriptive image generation prompts suitable for AI art tools like Midjourney, Lexica, or Leonardo.ai. Each prompt should be detailed, specifying style, colors, elements, and mood. Focus on a health and fitness channel. Concepts: {concept_content}"

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are an expert AI image prompt engineer for YouTube thumbnails."},
            {"role": "user", "content": prompt}
        ]
    )

    image_prompts = response.choices[0].message.content

    filename = f"content/thumbnails/image_prompts_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(image_prompts)
    print(f"Generated image prompts saved to {filename}")

if __name__ == "__main__":
    generate_image_prompt()
