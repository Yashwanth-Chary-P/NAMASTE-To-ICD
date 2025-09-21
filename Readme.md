# 🧾 NAMASTE to ICD-11 Mapping Project
This project aims to integrate **NAMASTE (National AYUSH Morbidity Codes)** with the **ICD-11 (International Classification of Diseases)** via the **Traditional Medicine Module (TM2)**. It provides APIs and tools for seamless mapping, enabling Electronic Medical Record (EMR) and Electronic Health Record (EHR) systems in India to achieve interoperability.
## 📌 Features
- 🔗 Mapping of **NAMASTE codes** to **ICD-11 TM2 codes**
- ⚡ RESTful backend using **Node.js + Express**
- 🗄️ **MongoDB** for storing mappings and clinical data
- 🔐 Ready for **integration with EMR/EHR systems**
- 🌐 Sandbox APIs for testing interoperability
## 🚀 Tech Stack
- **Frontend**: React + Vite  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Other Tools**: CORS, Dotenv, GitHub Actions (CI/CD)  
## 📂 Project Structure
```

NAMASTE-To-ICD/
│── backend/          # Node.js + Express backend
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   ├── routes/
│   └── .env
│
│── frontend/         # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
│── README.md

````
## ⚙️ Installation & Setup
### 1. Clone the repository
```bash
git clone https://github.com/Yashwanth-Chary-P/NAMASTE-To-ICD.git
cd NAMASTE-To-ICD
````

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```



## 🤝 Contribution

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Added feature'`)
4. Push branch (`git push origin feature-name`)
5. Create a Pull Request

## 📜 License

This project is licensed under the **MIT License**.

## 👥 Authors

* **Your Name** – Yashwath Chary
* Supported by **Ministry of AYUSH (India)**

### 📌 References

* [ICD-11 TM2](https://icd.who.int/dev11/l-m/en)
* [NAMASTE Portal](https://namstp.ayush.gov.in/#/namcCode)


 
