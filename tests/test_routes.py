# tests/test_routes.py

import pytest
from app.routes import app
import json

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_optimize_route(client):
    data = {
        "delivery_points": [[0, 0], [1, 1], [2, 2], [3, 3]]  # Dummy input
    }
    response = client.post('/optimize', json=data)
    assert response.status_code == 200
    result = json.loads(response.data)
    assert "optimized_route" in result
    assert len(result["optimized_route"]) > 0
