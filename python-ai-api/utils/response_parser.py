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
        
        total_meal_pattern = r'\*\*Total for this Meal\*\*[^\*]*?Calories?:\s*(\d+(?:\.\d+)?)\s*kcal[^\*]*?Carbs?:\s*(\d+(?:\.\d+)?)g[^\*]*?Protein:\s*(\d+(?:\.\d+)?)g[^\*]*?Fat:\s*(\d+(?:\.\d+)?)g'
        match = re.search(total_meal_pattern, response_text, re.IGNORECASE | re.DOTALL)
        
        if match:
            nutrition['calories'] = float(match.group(1))
            nutrition['carbs'] = float(match.group(2))
            nutrition['protein'] = float(match.group(3))
            nutrition['fat'] = float(match.group(4))
            return nutrition
        
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            parsed = json.loads(json_match.group())
            if 'calories' in parsed:
                return parsed
        
        cal_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:kcal|calories)', response_text, re.IGNORECASE)
        if cal_match:
            nutrition['calories'] = float(cal_match.group(1))
        
        carb_match = re.search(r'(?:carbs?|carbohydrate)[\s:]*(\d+(?:\.\d+)?)g', response_text, re.IGNORECASE)
        if carb_match:
            nutrition['carbs'] = float(carb_match.group(1))
        
        protein_match = re.search(r'protein[\s:]*(\d+(?:\.\d+)?)g', response_text, re.IGNORECASE)
        if protein_match:
            nutrition['protein'] = float(protein_match.group(1))
        
        fat_match = re.search(r'fat[\s:]*(\d+(?:\.\d+)?)g', response_text, re.IGNORECASE)
        if fat_match:
            nutrition['fat'] = float(fat_match.group(1))
        
        if nutrition['calories'] > 0:
            return nutrition
        
        return None
        
    except Exception as e:
        print(f"Error parsing response: {str(e)}")
        return None

def clean_json_response(text):
    """Clean and extract JSON from response"""
    # Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    text = text.strip()
    
    # Extract JSON object
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            return None
    
    return None