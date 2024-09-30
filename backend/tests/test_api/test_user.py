from tests.config_test import app, client, db_session


def test_register_user(client):
    """Test Register User"""

    payload = {"username": "kevxo", "password": "test113"}

    response = client.post("/api/v1/register", json=payload)

    assert response.status_code == 201
    assert response.json()["username"] == "kevxo"
