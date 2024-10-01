from tests.config_test import client, app, db_session
from tests.test_helper import create_random_user
from unittest.mock import patch


def test_create_expense(client, db_session):
    """Test create a expense"""

    user = create_random_user(db=db_session)

    expense_body = {"amount": 250.00, "category": "Car Insurance", "date": "2024-10-01"}

    with patch("jose.jwt.encode") as mock_encode:
        mock_encode.return_value = "mocked_token"

        body = {"username": "kevxo", "password": "Hello!"}

        login = client.post("/api/v1/login", data=body)
        token = login.json()["access_token"]

        with patch("jose.jwt.decode") as mock_decode:
            mock_decode.return_value = {"sub": "kevxo"}

            response = client.post(
                f"/api/v1/user/{user.uuid}/expenses",
                headers={"Authorization": f"Bearer {token}"},
                json=expense_body,
            )

            assert response.status_code == 201
            assert response.json()["amount"] == 250.0
            assert response.json()["category"] == "Car Insurance"
            assert response.json()["date"] == "2024-10-01"
            assert response.json()["user_uuid"] == user.uuid
