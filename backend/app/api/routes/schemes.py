"""
Government healthcare schemes catalog (Ayushman Bharat, PMJAY, CGHS, etc.)
"""
from fastapi import APIRouter

router = APIRouter(prefix="/schemes", tags=["schemes"])

SCHEMES_DATA = [
    {
        "id": "pmjay",
        "name": "Ayushman Bharat - PM-JAY",
        "tagline": "Pradhan Mantri Jan Arogya Yojana",
        "coverage": "₹5,00,000 per family per year",
        "beneficiary": "Poor and vulnerable families identified via SECC database",
        "services_included": [
            "Secondary and tertiary healthcare hospitalisation",
            "Pre and post-hospitalisation expenses (up to 15 days)",
            "All pre-existing conditions covered from day one",
            "Cashless access at public and empannelled private hospitals",
        ],
        "helpline": "14555",
        "portal_url": "https://pmjay.gov.in",
    },
    {
        "id": "ab-hwc",
        "name": "Ayushman Arogya Mandir (Health & Wellness Centres)",
        "tagline": "Comprehensive Primary Health Care",
        "coverage": "Free essential drugs and diagnostics at village/block level",
        "beneficiary": "All citizens across rural and urban communities",
        "services_included": [
            "Maternal and child health services",
            "Communicable disease management",
            "Screening for hypertension, diabetes, and cancers",
            "Teleconsultation with specialist doctors via eSanjeevani",
        ],
        "helpline": "1075",
        "portal_url": "https://ab-hwc.nhp.gov.in",
    },
    {
        "id": "cghs",
        "name": "Central Government Health Scheme (CGHS)",
        "tagline": "Comprehensive health care for central govt employees & pensioners",
        "coverage": "Complete medical care including OPD, inpatient, and wellness",
        "beneficiary": "Central government employees, pensioners, and eligible dependents",
        "services_included": [
            "OPD treatment at CGHS wellness centres",
            "Cashless treatment at empannelled private hospitals",
            "Specialist consultations and diagnostic tests",
            "Ayush treatment facilities",
        ],
        "helpline": "1800-208-8900",
        "portal_url": "https://cghs.nic.in",
    },
    {
        "id": "esic",
        "name": "Employees' State Insurance Scheme (ESIS)",
        "tagline": "Social security health cover for organized sector workers",
        "coverage": "Comprehensive medical benefits for insured persons and families",
        "beneficiary": "Employees earning up to ₹21,000 per month in covered establishments",
        "services_included": [
            "Full medical care without upper ceiling",
            "Sickness cash benefit during absence from work",
            "Maternity benefit for 26 weeks",
            "Disablement and dependent pension benefits",
        ],
        "helpline": "1800-11-2526",
        "portal_url": "https://esic.gov.in",
    },
    {
        "id": "jsy",
        "name": "Janani Suraksha Yojana (JSY)",
        "tagline": "Safe motherhood intervention under National Health Mission",
        "coverage": "Cash assistance for institutional delivery: ₹1400 rural / ₹1000 urban",
        "beneficiary": "Pregnant women, especially from BPL, SC and ST families",
        "services_included": [
            "Free delivery in public healthcare institutions",
            "ASHA assistance for transport and institutional care",
            "Post-delivery care and immunisation tracking",
        ],
        "helpline": "104",
        "portal_url": "https://nhm.gov.in",
    },
]


@router.get("/")
def get_schemes():
    return SCHEMES_DATA
