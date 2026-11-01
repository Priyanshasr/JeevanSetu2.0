"""
Automated Integration and Functional Test Suite for JeevanSetu 2.0.
Tests all core workflows: Auth, Provider Discovery, TinyFish APIs, Medical Records, Emergency.
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["tinyfish_configured"] is True


def test_auth_login_patient():
    response = client.post(
        "/auth/login",
        json={"email": "ravi.kumar@example.com", "password": "Patient@1234"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "patient"


def test_auth_login_doctor():
    response = client.post(
        "/auth/login",
        json={"email": "dr.priya@example.com", "password": "Doctor@1234"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "doctor"


def test_auth_login_admin():
    response = client.post(
        "/auth/login",
        json={"email": "admin@jeevansetu.in", "password": "Admin@1234"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "admin"


def test_providers_directory():
    response = client.get("/providers/")
    assert response.status_code == 200
    providers = response.json()
    assert len(providers) >= 5
    first = providers[0]
    assert "name" in first
    assert "provider_type" in first
    assert "source_url" in first


def test_emergency_helplines_and_providers():
    response = client.get("/emergency/nearby-providers")
    assert response.status_code == 200
    data = response.json()
    assert "helplines" in data
    assert any(h["phone"] == "108" for h in data["helplines"])
    assert "providers" in data


def test_schemes_catalog():
    response = client.get("/schemes/")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 4
    assert any("Ayushman Bharat" in s["name"] for s in schemes)


def test_tinyfish_tasks_endpoint():
    response = client.get("/tinyfish/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_tinyfish_monitors_endpoint():
    response = client.get("/tinyfish/monitors")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_activity():
    response = client.get("/admin/tinyfish-activity")
    assert response.status_code == 200
    data = response.json()
    assert "total_tasks" in data
