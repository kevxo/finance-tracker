from tests.config_test import app, client, db_session
from tests.test_helper import create_random_user
from unittest.mock import patch


def test_login(client, db_session):
    """Test login authentication"""

    create_random_user(db=db_session)

    with patch("jose.jwt.encode") as mock_encode:
        mock_encode.return_value = "mocked_token"

        body = {"username": "kevxo", "password": "Hello!"}

        response = client.post("/api/v1/login", data=body)

        assert response.status_code == 200
        assert response.json()["access_token"] == "mocked_token"
        assert response.json()["token_type"] == "bearer"

        mock_encode.assert_called_once()
