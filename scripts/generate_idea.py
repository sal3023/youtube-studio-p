import os
from openai import OpenAI
from datetime import datetime

def generate_idea():
    api_key = os.getenv("OPENAI_API_KEY") # Still use OPENAI_API_KEY for compatibility
    base_url = os.getenv("LLM_API_BASE", "https://api.openai.com/v1")
    model_name = os.getenv("LLM_MODEL", "gpt-4.1-mini") # Default to gpt-4.1-mini if not specified

    client = OpenAI(api_key=api_key, base_url=base_url)

    prompt = "Generate a compelling and trending YouTube video idea for a health and fitness channel. The idea should be engaging, relevant for 2026, and suitable for a general audience. Provide only the title and a brief, one-paragraph description. Focus on topics like home workouts, healthy eating, mental wellness, or quick fitness tips."

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a creative YouTube content strategist for a health and fitness channel."},
            {"role": "user", "content": prompt}
        ]
    )

    idea_content = response.choices[0].message.content
    
    # Extract title and description for better formatting
    lines = idea_content.split("\n")
    title = lines[0].strip()
    description = "\n".join(lines[1:]).strip()

    filename = f"content/ideas/idea_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n\n{description}\n")
    print(f"Generated idea saved to {filename}")

if __name__ == "__main__":
    generate_idea()
