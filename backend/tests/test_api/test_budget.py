from tests.config_test import client, app, db_session
from tests.test_helper import (
    create_random_user,
    create_random_budget,
    create_random_expense,
)
from unittest.mock import patch


def test_create_budget(client, db_session):
    """Test create budget"""

    user = create_random_user(db=db_session)

    budget_body = {"budget_amount": 1500.00, "month": "2024-10-13"}

    with patch("jose.jwt.encode") as mock_encode:
        mock_encode.return_value = "mocked_token"

        body = {"username": "kevxo", "password": "Hello!"}

        login = client.post("/api/v1/login", data=body)
        token = login.json()["access_token"]

        with patch("jose.jwt.decode") as mock_decode:
            mock_decode.return_value = {"sub": "kevxo"}

            response = client.post(
                f"/api/v1/users/{user.uuid}/budgets",
                json=budget_body,
                headers={"Authorization": f"Bearer {token}"},
            )

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

            response = client.get(
                f"/api/v1/users/{budget.user_uuid}/budgets/{budget.uuid}",
                headers={"Authorization": f"Bearer {token}"},
            )

            assert response.status_code == 200
            assert response.json()["budget_amount"] == 1500.00
            assert response.json()["month"] == "2024-10-01"
            assert response.json()["uuid"] == budget.uuid
            assert response.json()["expenses_total"]
            assert response.json()["remaining_budget"]


def test_get_all_budget_history(client, db_session):
    """Test get all budget history"""

    budget = create_random_budget(db_session)

    with patch("jose.jwt.encode") as mock_encode:
        mock_encode.return_value = "mocked_token"

        body = {"username": "kevxo", "password": "Hello!"}

        login = client.post("/api/v1/login", data=body)
        token = login.json()["access_token"]

        with patch("jose.jwt.decode") as mock_decode:
            mock_decode.return_value = {"sub": "kevxo"}

            response = client.get(
                f"/api/v1/users/{budget.user_uuid}/budgets/history",
                headers={"Authorization": f"Bearer {token}"},
            )

            assert response.status_code == 200
            assert response.json()[0]["budget_amount"] == 1500.00
            assert response.json()[0]["month"] == "2024-10-01"
            assert response.json()[0]["uuid"] == budget.uuid
            assert response.json()[0]["expenses_total"]
            assert response.json()[0]["remaining_budget"]
