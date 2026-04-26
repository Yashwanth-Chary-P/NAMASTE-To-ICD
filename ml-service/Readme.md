# 🧠 NAMASTE ML Service

This is the **ML Mapping Service** for the NAMASTE → ICD-11/TM2 project.

It is responsible for:
- Mapping Traditional Medicine (Ayurveda / Siddha / Unani)
- To modern classification systems (ICD-11 / TM2)
- Using TF-IDF + Cosine Similarity + Heuristic Boosting

---

# 🚀 Features

✔ TF-IDF based ranking  
✔ Sanskrit-aware matching  
✔ Exact match boosting  
✔ Tagging (Equivalent / Narrower / Related / Weak)  
✔ Confidence scoring (high / medium / low)  
✔ Highlighted matched text  
✔ In-memory caching  
✔ MongoDB Atlas integration  

---

# 🏗️ Architecture


Frontend → Backend (Node) → ML-Service (FastAPI) → MongoDB


---

# 📁 Project Structure


ml-service/
├── .env
├── requirements.txt
├── run.sh
└── app/
├── main.py
├── config.py
├── database.py
├── routes/
├── services/
└── utils/


---

# ⚙️ Setup Instructions

## 1️⃣ Clone project

```bash
git clone <your-repo-url>
cd ml-service
2️⃣ Create virtual environment
python -m venv venv
Activate (Git Bash)
source venv/Scripts/activate
3️⃣ Install dependencies
pip install -r requirements.txt
4️⃣ Setup environment variables

Create .env file:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=medical_mapping
PORT=8000

⚠️ Do NOT add quotes.

5️⃣ Run the server
./run.sh

OR

uvicorn app.main:app --reload
🌐 API Endpoints
✅ Health Check
GET /health

Response:

{
  "status": "ok"
}
🔥 Mapping Endpoint
POST /map
Request Body
{
  "source_system": "ayurveda",
  "code": "AYU",
  "target": "both",
  "top_k": 5
}
Parameters
Field	Description
source_system	ayurveda / siddha / unani
code	Selected disease code
target	tm2 / icd11 / both
top_k	Number of results
📊 Response Example
{
  "source_system": "ayurveda",
  "code": "AYU",
  "tm2": [
    {
      "code": "SK00",
      "score": 0.91,
      "tag": "Equivalent",
      "confidence": "high",
      "match_reason": "Matched keywords: headache",
      "highlighted_title": "Cephalalgia disorder"
    }
  ]
}
🧠 Ranking Logic
✔ TF-IDF + Cosine Similarity
✔ Boosting:
Exact match → +0.25
Keyword overlap → +0.05 per match
🏷️ Tag Logic
Score	Tag
≥ 0.80	Equivalent
≥ 0.60	Narrower
≥ 0.40	Related
< 0.40	Weak
📈 Confidence Logic
Score	Confidence
> 0.8	High
> 0.5	Medium
≤ 0.5	Low
⚡ Cache System
In-memory dictionary
Key format:
source::code::target::top_k
🧪 Testing

Open Swagger UI:

http://127.0.0.1:8000/docs
🚨 Common Issues
❌ No data found

✔ Check MongoDB URI
✔ Ensure Atlas is connected

❌ .env not working

✔ Ensure load_dotenv() is used
✔ No quotes in .env

❌ 404 Source not found

✔ Use exact code (e.g. AAA-1, not AAA)

🚀 Future Improvements
Vector embeddings (semantic search)
Hybrid ranking (BM25 + ML)
Multilingual support
FHIR integration
Result feedback learning
🎯 Final Summary
User selects disease → ML-service ranks ICD/TM2 → returns best matches
👨‍💻 Author

Built as part of NAMASTE → ICD mapping system.


---

# ✅ FINAL RESULT

Now your project has:

✔ Clean code  
✔ Proper env handling  
✔ Reproducible setup  
✔ Documentation  
✔ Git hygiene  

---

If you want next:

👉 I can help you write **resume description for this project**  
👉 Or **explain it for interviews (very important)**