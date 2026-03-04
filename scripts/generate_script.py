import os
from openai import OpenAI
from datetime import datetime
import glob

def generate_script():
    api_key = os.getenv("OPENAI_API_KEY") # Still use OPENAI_API_KEY for compatibility
    base_url = os.getenv("LLM_API_BASE", "https://api.openai.com/v1")
    model_name = os.getenv("LLM_MODEL", "gpt-4.1-mini") # Default to gpt-4.1-mini if not specified

    client = OpenAI(api_key=api_key, base_url=base_url)

    # Find the latest generated idea
    list_of_ideas = glob.glob("content/ideas/*.md")
    if not list_of_ideas:
        print("No ideas found. Please generate an idea first.")
        return
    latest_idea_file = max(list_of_ideas, key=os.path.getctime)

    with open(latest_idea_file, "r", encoding="utf-8") as f:
        idea_content = f.read()

    prompt = f"Expand the following YouTube video idea into a detailed script. The script should include an introduction, main points with talking points, a call to action, and an outro. Focus on a health and fitness channel. Idea: {idea_content}"

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a professional YouTube scriptwriter for a health and fitness channel."},
            {"role": "user", "content": prompt}
        ]
    )

    script_content = response.choices[0].message.content

    filename = f"content/scripts/script_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(script_content)
    print(f"Generated script saved to {filename}")

if __name__ == "__main__":
    generate_script()
