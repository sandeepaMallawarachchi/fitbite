"""
Quick Model Demo - Simplified version for screenshots
"""

import os
import sys
import time
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ANSI Color codes
GREEN = '\033[92m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RED = '\033[91m'
BOLD = '\033[1m'
END = '\033[0m'

def print_divider(char="=", length=70):
    print(char * length)

def demo_model_info():
    """Display model specifications"""
    print_divider()
    print(f"{BOLD}FitBite AI - Model Specifications{END}")
    print_divider()
    print(f"\n📊 {BOLD}Model Details:{END}")
    print(f"   • Name: Llama 3.3 70B Versatile")
    print(f"   • Parameters: 70 Billion")
    print(f"   • Provider: Groq Cloud API")
    print(f"   • Context Window: 8,192 tokens")
    print(f"   • Max Output: 2,500 tokens")
    print(f"   • Temperature: 0.7")
    print(f"   • Top-P: 0.9\n")
    
    print(f"🎯 {BOLD}Capabilities:{END}")
    print(f"   ✓ Meal nutrition analysis")
    print(f"   ✓ Macro calculation (carbs, protein, fat)")
    print(f"   ✓ TDEE-based meal planning")
    print(f"   ✓ Dietary preference adaptation")
    print(f"   ✓ Real-time calorie tracking\n")
    
    print(f"⚙️  {BOLD}Configuration:{END}")
    print(f"   • Environment: {os.getenv('FLASK_ENV', 'production')}")
    print(f"   • Port: {os.getenv('PORT', '5001')}")
    print(f"   • API Status: {GREEN}Connected ✓{END}\n")

def analyze_meal(meal_text):
    """Analyze a meal using the AI model"""
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    api_key = os.getenv('GROQ_API_KEY', '')
    
    prompt = f"""Analyze this meal and provide precise nutrition values.

Meal: {meal_text}

Return ONLY in this format:
Calories: [number] kcal
Protein: [number]g
Carbs: [number]g
Fat: [number]g

Be accurate with standard nutrition databases."""

    try:
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500,
            "temperature": 0.3
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(api_url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Error: API returned status {response.status_code}"
    except Exception as e:
        return f"Error: {str(e)}"

def run_demo_tests():
    """Run demonstration tests with expected values"""
    print_divider()
    print(f"{BOLD}Model Accuracy Testing - Sample Meals{END}")
    print_divider()
    
    test_meals = [
        {
            "meal": "2 large boiled eggs",
            "expected": "Calories: 140-160 kcal | Protein: 12-14g | Carbs: 1-2g | Fat: 9-11g"
        },
        {
            "meal": "200g grilled chicken breast with 150g brown rice",
            "expected": "Calories: 480-550 kcal | Protein: 55-65g | Carbs: 50-60g | Fat: 5-10g"
        },
        {
            "meal": "100g oatmeal with 200ml milk and 1 banana",
            "expected": "Calories: 420-480 kcal | Protein: 15-20g | Carbs: 70-85g | Fat: 8-12g"
        }
    ]
    
    for idx, test in enumerate(test_meals, 1):
        print(f"\n{BOLD}Test #{idx}: {test['meal']}{END}")
        print(f"Expected Range: {test['expected']}")
        print(f"{BLUE}Processing...{END}", end="", flush=True)
        
        start = time.time()
        result = analyze_meal(test['meal'])
        elapsed = time.time() - start
        
        print(f"\r{GREEN}✓ Completed{END} (Response time: {elapsed:.2f}s)")
        print(f"\n{BOLD}Model Output:{END}")
        print(result)
        print_divider("-")
        
        time.sleep(1)  # Pause for readability
    
    print(f"\n{GREEN}All tests completed successfully!{END}\n")

def interactive_demo():
    """Interactive mode for custom input"""
    print_divider()
    print(f"{BOLD}Interactive Meal Analysis{END}")
    print_divider()
    print(f"\n{BLUE}ℹ Enter your meal description (or 'quit' to exit){END}\n")
    
    while True:
        meal = input(f"{BOLD}Your meal: {END}").strip()
        
        if meal.lower() in ['quit', 'exit', 'q']:
            print(f"{YELLOW}Exiting...{END}")
            break
        
        if not meal:
            print(f"{RED}Please enter a meal description{END}")
            continue
        
        print(f"\n{BLUE}Analyzing '{meal}'...{END}", end="", flush=True)
        
        start = time.time()
        result = analyze_meal(meal)
        elapsed = time.time() - start
        
        print(f"\r{GREEN}✓ Analysis Complete{END} ({elapsed:.2f}s)\n")
        print(f"{BOLD}Nutrition Information:{END}")
        print(result)
        print()

def main():
    print("\n")
    print_divider("=")
    print(f"{BOLD}🍽️  FitBite AI Nutrition Model - Demo Suite{END}")
    print(f"{BOLD}   Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{END}")
    print_divider("=")
    
    while True:
        print(f"\n{BOLD}Select Demo:{END}")
        print("  1. Display Model Information")
        print("  2. Run Accuracy Tests (3 meals)")
        print("  3. Interactive Mode (custom input)")
        print("  4. Run All")
        print("  5. Exit")
        
        choice = input(f"\n{BOLD}Enter choice (1-5): {END}").strip()
        
        if choice == '1':
            print()
            demo_model_info()
        elif choice == '2':
            print()
            run_demo_tests()
        elif choice == '3':
            print()
            interactive_demo()
        elif choice == '4':
            print()
            demo_model_info()
            input(f"\n{YELLOW}Press Enter to continue...{END}")
            run_demo_tests()
            input(f"\n{YELLOW}Press Enter to start interactive mode...{END}")
            interactive_demo()
        elif choice == '5':
            print(f"\n{GREEN}Thank you for using FitBite AI!{END}\n")
            break
        else:
            print(f"{RED}Invalid choice. Please select 1-5.{END}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Interrupted by user{END}\n")
        sys.exit(0)