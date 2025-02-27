import requests
from config import CRUNCHBASE_API_KEY

def get_startup_data(startup_name):
    url = f"https://api.crunchbase.com/v3.1/organizations/{startup_name}"
    params = {"user_key": CRUNCHBASE_API_KEY}
    response = requests.get(url, params=params)
    return response.json()

# Example usage
if __name__ == "__main__":
    print(get_startup_data("stripe"))
