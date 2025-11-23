import json
import re

def parse_nutrition_response(response_text):
    """Parse AI response to extract nutrition data"""
    try:
        # Try to extract JSON if present
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            return json.loads(json_match.group())
        
        # If no JSON, extract macros from text
        nutrition = {
            'calories': 0,
            'carbs': 0,
            'protein': 0,
            'fat': 0
        }
        
        # Extract calories
        cal_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:kcal|calories)', response_text, re.IGNORECASE)
        if cal_match:
            nutrition['calories'] = float(cal_match.group(1))
        
        # Extract carbs
        carb_match = re.search(r'(?:carbs?|carbohydrate)[\s:]*(\d+(?:\.\d+)?)g', response_text, re.IGNORECASE)
        if carb_match:
            nutrition['carbs'] = float(carb_match.group(1))
        
        # Extract protein
        protein_match = re.search(r'protein[\s:]*(\d+(?:\.\d+)?)g', response_text, re.IGNORECASE)
        if protein_match:
            nutrition['protein'] = float(protein_match.group(1))
        
        # Extract fat
        fat_match = re.search(r'fat[\s:]*(\d+(?:\.\d+)?)g', response_text, re.IGNORECASE)
        if fat_match:
            nutrition['fat'] = float(fat_match.group(1))
        
        return nutrition
        
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