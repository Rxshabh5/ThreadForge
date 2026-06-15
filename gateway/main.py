from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Header
import os

import requests

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080")
NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")


# =========================
# AUTH
# =========================

@app.post("/auth/register")
def register_user(user: dict):

    response = requests.post(
        f"{SPRING_BOOT_URL}/auth/register",
        json=user
    )

    return response.json()


@app.post("/auth/login")
def login_user(user: dict):

    response = requests.post(
        f"{SPRING_BOOT_URL}/auth/login",
        json=user
    )

    return response.json()


# =========================
# POSTS
# =========================

# GET POSTS (PUBLIC)
@app.get("/posts")
def get_posts():

    response = requests.get(
        f"{SPRING_BOOT_URL}/posts"
    )

    return response.json()


@app.get("/posts/mine")
def get_my_posts(authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.get(f"{SPRING_BOOT_URL}/posts/mine", headers=headers)
    return response.json()


# CREATE POST (PROTECTED)
@app.post("/posts")
def create_post(
    post: dict,
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.post(
        f"{SPRING_BOOT_URL}/posts",
        json=post,
        headers=headers
    )

    return response.json()


# UPDATE POST (PROTECTED)
@app.put("/posts/{id}")
def update_post(
    id: int,
    post: dict,
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.put(
        f"{SPRING_BOOT_URL}/posts/{id}",
        json=post,
        headers=headers
    )

    return response.json()


# DELETE POST (PROTECTED)
@app.delete("/posts/{id}")
def delete_post(
    id: int,
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.delete(
        f"{SPRING_BOOT_URL}/posts/{id}",
        headers=headers
    )

    response.raise_for_status()

    return {
        "message": "Post deleted"
    }


# =========================
# COMMENTS

@app.get("/comments/post/{post_id}")
def get_comments(post_id: int):
    response = requests.get(
        f"{SPRING_BOOT_URL}/comments/post/{post_id}"
    )
    return response.json()


@app.post("/comments")
def create_comment(comment: dict, authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.post(
        f"{SPRING_BOOT_URL}/comments",
        json=comment,
        headers=headers
    )
    return response.json()


@app.post("/comments/{id}/like")
def like_comment(id: int, authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.post(
        f"{SPRING_BOOT_URL}/comments/{id}/like",
        json={},
        headers=headers
    )
    return response.json()


# =========================
# DRAFTS
# =========================


@app.post("/drafts")
def save_draft(draft: dict, authorization: str = Header(None)):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.post(
        f"{SPRING_BOOT_URL}/drafts",
        json=draft,
        headers=headers
    )

    return response.json()


@app.get("/drafts/{email}")
def get_drafts(email: str, authorization: str = Header(None)):

    headers = {}
    if authorization:
        headers["Authorization"] = authorization

    response = requests.get(
        f"{SPRING_BOOT_URL}/drafts/{email}",
        headers=headers
    )

    return response.json()


@app.post("/drafts/publish/{id}")
def publish_draft(id: int, authorization: str = Header(None)):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.post(
        f"{SPRING_BOOT_URL}/drafts/publish/{id}",
        headers=headers
    )

    return response.json()


@app.post("/drafts/review/{id}")
def submit_draft_for_review(id: int, authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.post(
        f"{SPRING_BOOT_URL}/drafts/review/{id}",
        headers=headers
    )
    return response.json()


@app.delete("/drafts/{id}")
def delete_draft(id: int, authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.delete(
        f"{SPRING_BOOT_URL}/drafts/{id}",
        headers=headers
    )
    response.raise_for_status()
    return response.json()


# =========================
# SEARCH (gateway-side filtering)
# =========================


@app.get("/search")
def search(q: str = None, category: str = None, tags: str = None, dateFrom: str = None, dateTo: str = None):

    # Fetch all posts from Spring Boot then filter in the gateway
    response = requests.get(f"{SPRING_BOOT_URL}/posts")

    posts = response.json()

    def matches(p):
        if q:
            ql = q.lower()
            if ql not in (p.get('title','') or '').lower() and ql not in (p.get('content','') or '').lower():
                return False
        if category:
            if category.lower() != (p.get('category','') or '').lower():
                return False
        if tags:
            wanted = [t.strip().lower() for t in tags.split(',') if t.strip()]
            post_tags = [t.lower() for t in (p.get('tags') or [])]
            if not all(w in post_tags for w in wanted):
                return False
        return True

    results = [p for p in posts if matches(p)]

    return results


# =========================
# VERSIONS & LOGS (forward to node backend)
# =========================


@app.post("/versions")
def create_version(version: dict):

    response = requests.post(
        f"{NODE_BACKEND_URL}/versions",
        json=version
    )

    return response.json()


@app.get("/versions")
def list_versions(postId: int = None, authorization: str = Header(None)):

    params = {}
    if postId is not None:
        params["postId"] = postId

    headers = {}
    if authorization:
        headers["Authorization"] = authorization

    response = requests.get(
        f"{NODE_BACKEND_URL}/versions",
        headers=headers,
        params=params
    )

    return response.json()


@app.post("/logs")
def create_log(log: dict):

    response = requests.post(
        f"{NODE_BACKEND_URL}/logs",
        json=log
    )

    return response.json()


# =========================
# HEALTH
# =========================


@app.get("/health")
def health():

    return {"status": "running"}


# =========================
# ADMIN
# =========================

@app.get("/admin/users")
def get_admin_users(
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.get(
        f"{SPRING_BOOT_URL}/admin/users",
        headers=headers
    )

    return response.json()


@app.get("/admin/posts")
def get_admin_posts(authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.get(
        f"{SPRING_BOOT_URL}/admin/posts",
        headers=headers
    )
    return response.json()


@app.get("/admin/stats")
def get_admin_stats(authorization: str = Header(None)):
    headers = {}
    if authorization:
        headers["Authorization"] = authorization
    response = requests.get(
        f"{SPRING_BOOT_URL}/admin/stats",
        headers=headers
    )
    return response.json()


@app.delete("/admin/users/{id}")
def delete_admin_user(
    id: int,
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.delete(
        f"{SPRING_BOOT_URL}/admin/users/{id}",
        headers=headers
    )

    return response.json()


@app.put("/admin/users/{id}/role")
def update_admin_user_role(
    id: int,
    payload: dict,
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.put(
        f"{SPRING_BOOT_URL}/admin/users/{id}/role",
        headers=headers,
        json=payload
    )

    return response.json()


@app.get("/admin/logs")
def get_admin_logs(
    authorization: str = Header(None)
):

    headers = {}

    if authorization:
        headers["Authorization"] = authorization

    response = requests.get(
        f"{NODE_BACKEND_URL}/logs",
        headers=headers
    )

    return response.json()
