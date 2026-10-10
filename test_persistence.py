import os
import sys
from urllib.parse import urlparse

# Load environment variables if python-dotenv is installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def run_persistence_test():
    print("==================================================")
    print("      TURSO DATABASE PERSISTENCE TEST SCRIPT      ")
    print("==================================================")

    turso_url = os.environ.get("TURSO_DATABASE_URL", "").strip()
    turso_token = os.environ.get("TURSO_AUTH_TOKEN", "").strip()

    if not turso_url or not turso_token:
        print("FAIL: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in environment.")
        return False

    try:
        import libsql_client
    except ImportError:
        print("FAIL: libsql-client Python package is not installed.")
        return False

    http_url = turso_url.replace("libsql://", "https://")
    parsed = urlparse(http_url)
    host_only = parsed.netloc or parsed.path
    print(f"Connecting to Turso Host: {host_only}")

    test_title = "AUTOMATED_PERSISTENCE_TEST_PROJECT_999"

    # Connection 1: Insert test project
    print("\n[Step 1] Connection A: Inserting test project into Turso...")
    try:
        client_a = libsql_client.create_client_sync(url=http_url, auth_token=turso_token)
        cat_res = client_a.execute("SELECT id FROM categories LIMIT 1")
        if not cat_res.rows:
            print("FAIL: No categories found in database.")
            client_a.close()
            return False
        cat_id = cat_res.rows[0][0]

        client_a.execute('''
            INSERT INTO projects (title, category_id, description, tech_stack, project_url, github_url, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (test_title, cat_id, "Persistence verification test project", "Python, Turso", "https://example.com", "https://github.com", ""))
        client_a.close()
        print("-> Inserted test project successfully!")
    except Exception as e:
        print(f"FAIL during Connection A insert: {e}")
        return False

    # Connection 2: Query back test project using a NEW connection
    print("\n[Step 2] Connection B: Reading back test project via a completely NEW connection...")
    try:
        client_b = libsql_client.create_client_sync(url=http_url, auth_token=turso_token)
        read_res = client_b.execute("SELECT title, description FROM projects WHERE title = ?", (test_title,))
        client_b.close()

        if not read_res.rows:
            print("FAIL: Test project inserted by Connection A was NOT found by Connection B.")
            return False

        row = read_res.rows[0]
        print(f"-> Successfully retrieved test project: {row[0]} ('{row[1]}')")
    except Exception as e:
        print(f"FAIL during Connection B query: {e}")
        return False

    # Connection 3: Clean up test project
    print("\n[Step 3] Connection C: Deleting test project...")
    try:
        client_c = libsql_client.create_client_sync(url=http_url, auth_token=turso_token)
        client_c.execute("DELETE FROM projects WHERE title = ?", (test_title,))
        client_c.close()
        print("-> Cleaned up test project successfully!")
    except Exception as e:
        print(f"Warning: Cleanup failed: {e}")

    print("\n==================================================")
    print("PASS")
    print("==================================================")
    return True


if __name__ == "__main__":
    success = run_persistence_test()
    sys.exit(0 if success else 1)
