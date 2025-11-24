import json
import re

def parse_nutrition_response(response_text):
    try:
        nutrition = {
            'calories': 0,
            'carbs': 0,
            'protein': 0,
            'fat': 0
        }
        
        # Priority 1: Extract from "Total for this Meal" section with equation (= final_value)
        total_meal_pattern = r'\*\*Total for this Meal\*\*[\s\S]*?Calories?:[^\d]*[\d\s+.]*=\s*(\d+(?:\.\d+)?)\s*kcal[\s\S]*?Carbs?:[^\d]*[\d\s+.]*=\s*(\d+(?:\.\d+)?)g[\s\S]*?Protein:[^\d]*[\d\s+.]*=\s*(\d+(?:\.\d+)?)g[\s\S]*?Fat:[^\d]*[\d\s+.]*=\s*(\d+(?:\.\d+)?)g'
        
        match = re.search(total_meal_pattern, response_text, re.IGNORECASE)
        
        if match:
            nutrition['calories'] = float(match.group(1))
            nutrition['carbs'] = float(match.group(2))
            nutrition['protein'] = float(match.group(3))
            nutrition['fat'] = float(match.group(4))
            
            print(f"Parsed nutrition (from equation): {nutrition}")
            return nutrition
        
        # Priority 2: Simple format without equation
        simple_pattern = r'\*\*Total for this Meal\*\*[\s\S]*?Calories?:\s*(\d+(?:\.\d+)?)\s*kcal[\s\S]*?Carbs?:\s*(\d+(?:\.\d+)?)g[\s\S]*?Protein:\s*(\d+(?:\.\d+)?)g[\s\S]*?Fat:\s*(\d+(?:\.\d+)?)g'
        
        simple_match = re.search(simple_pattern, response_text, re.IGNORECASE)
        
        if simple_match:
            nutrition['calories'] = float(simple_match.group(1))
            nutrition['carbs'] = float(simple_match.group(2))
            nutrition['protein'] = float(simple_match.group(3))
            nutrition['fat'] = float(simple_match.group(4))
            
            print(f"Parsed nutrition (simple format): {nutrition}")
            return nutrition
        
        print("Could not parse nutrition from response")
        return None
        
    except Exception as e:
        print(f"Error parsing response: {str(e)}")
        return None


def clean_json_response(text):
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    text = text.strip()
    
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            return None
    
    return None