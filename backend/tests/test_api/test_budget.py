from tests.config_test import client, app, db_session
from tests.test_helper import create_random_user, create_random_budget
from unittest.mock import patch

def test_create_budget(client, db_session):
    """Test create budget"""

    user = create_random_user(db=db_session)

    budget_body = {
        "budget_amount": 1500.00,
        "month": "2024-10-13"
    }


    with patch("jose.jwt.encode") as mock_encode:
        mock_encode.return_value = "mocked_token"

        body = {"username": "kevxo", "password": "Hello!"}

        login = client.post("/api/v1/login", data=body)
        token = login.json()["access_token"]

        with patch("jose.jwt.decode") as mock_decode:
            mock_decode.return_value = {"sub": "kevxo"}


            response = client.post(f"/api/v1/users/{user.uuid}/budgets", json=budget_body, headers={"Authorization": f"Bearer {token}"})

            assert response.status_code == 201
            assert response.json()["budget_amount"] == 1500.00
            assert response.json()["month"] == "2024-10-13"

def test_get_budget(client, db_session):
    """Test get budget"""
    budget = create_random_budget(db=db_session)

    with patch("jose.jwt.encode") as mock_encode:
        mock_encode.return_value = "mocked_token"

        body = {"username": "kevxo", "password": "Hello!"}

        login = client.post("/api/v1/login", data=body)
        token = login.json()["access_token"]

        with patch("jose.jwt.decode") as mock_decode:
            mock_decode.return_value = {"sub": "kevxo"}

            response = client.get(f"/api/v1/users/{budget.user_uuid}/budgets/{budget.uuid}", headers={"Authorization": f"Bearer {token}"})

            assert response.status_code == 200
            assert response.json()["budget_amount"] == 1500.00
            assert response.json()["month"] == "2024-10-13"
            assert response.json()["uuid"] == budget.uuid
            assert response.json()["user_uuid"] == budget.user_uuid

