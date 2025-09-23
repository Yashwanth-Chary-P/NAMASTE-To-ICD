import app from "./Footer/app.jpg"
import pay from "./Footer/pay.png"
import play from "./Footer/play.jpg"
import Logo from "./Navbar/Logo.png"
import Leaf from "./Home Hero/Hero Left/Leaf.png"
import Modi from "./Home Hero/Hero Left/Modi.png"
import AyushDoctors from "./Home Hero/Hero Middle/AyushDoctors.png"
import AyushInstitutions from "./Home Hero/Hero Middle/AyushInstitutions.png"
import AyushResearchers from "./Home Hero/Hero Middle/AyushResearchers.png"
import AyushScientists from "./Home Hero/Hero Middle/AyushScientists.png"
import AyushTeachers from "./Home Hero/Hero Middle/AyushTeachers.png"
import HealthWorkers from "./Home Hero/Hero Middle/AyushDoctors.png"
import ICD from "./Home Hero/ICD-11.png"
import Ayurvedha from "./AYUSHI/Ayurvedha.png"
import Siddha from "./AYUSHI/Siddha.png"
import Unani from "./AYUSHI/Unani.png"
export const assets = {
    pay, play, app, // footer
    Logo, //Navbar

    Leaf,Modi, // LEft hero 1
    AyushDoctors,AyushInstitutions,AyushResearchers,AyushScientists,AyushTeachers,HealthWorkers,
    ICD,
    Ayurvedha,Siddha,Unani
}
export const homeMiddle = [
    {
        id: 0,
        image: AyushDoctors,
        text: "AyushDoctors",
    },
    {
        id: 1,
        image: AyushInstitutions,
        text: "AyushInstitutions",
    },
    {
        id: 2,
        image: AyushResearchers,
        text: "AyushResearchers",
    },
    {
        id: 3,
        image: AyushScientists,
        text: "AyushScientists",
    },
    {
        id: 4,
        image: AyushTeachers,
        text: "AyushTeachers",
    },
    {
        id: 5,
        image: HealthWorkers,
        text: "HealthWorkers",
    },
];

export const projectUses = [
  {
    id: 0,
    title: "Standardization of Traditional Medicine",
    description: "Ensures all Ayush morbidity codes are standardized and interoperable with ICD-11, facilitating accurate diagnosis, reporting, and integration with mainstream healthcare systems."
  },
  {
    id: 1,
    title: "Improved Patient Care",
    description: "Helps practitioners provide better patient care by linking traditional medicine treatments with internationally recognized coding, making patient history more comprehensive."
  },
  {
    id: 2,
    title: "Research & Evidence Generation",
    description: "Enables researchers to study trends, treatment outcomes, and prevalence of conditions treated under Ayush systems using standardized digital data."
  },
  {
    id: 3,
    title: "Policy & Planning Support",
    description: "Supports health authorities and policymakers in planning interventions, tracking disease patterns, and implementing Ayush programs effectively."
  },
  {
    id: 4,
    title: "Global Recognition",
    description: "Promotes India’s traditional medicine systems globally by mapping NAMASTE codes to ICD-11, making Ayush data understandable and usable internationally."
  },
  {
    id: 5,
    title: "Digital Transformation",
    description: "Encourages the adoption of digital tools in Ayush practice, enabling secure, accessible, and interoperable electronic health records."
  }
];


export const traditionalSystems = [
    {
        id: 0,
        image: Ayurvedha,
        text: "Ayurveda: Traditional Indian medicine system focusing on holistic healing, diet, herbs, and lifestyle for balance of body and mind."
    },
    {
        id: 1,
        image: Siddha,
        text: "Siddha: Ancient South Indian medical system emphasizing herbal remedies, minerals, and spiritual practices for overall wellness."
    },
    {
        id: 2,
        image: Unani,
        text: "Unani: Greco-Arabic system of medicine using natural remedies, dietary regulation, and therapies to maintain the body's equilibrium."
    },
    
];

