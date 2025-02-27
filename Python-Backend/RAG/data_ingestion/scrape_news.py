import requests
from config import SERPAPI_KEY

def get_news_articles(query):
    url = "https://serpapi.com/search"
    params = {
        "q": query + " startup funding",
        "api_key": SERPAPI_KEY,
        "tbm": "nws"
    }
    response = requests.get(url, params=params)
    data = response.json()
    return [{"title": item["title"], "link": item["link"]} for item in data.get("news_results", [])]

# Example usage
if __name__ == "__main__":
    print(get_news_articles("AI startup"))
