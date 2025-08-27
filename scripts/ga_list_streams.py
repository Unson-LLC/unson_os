import json
import os
from urllib.parse import urlparse

from google.oauth2 import service_account
from googleapiclient.discovery import build


def load_credentials(sa_path: str):
    scopes = ["https://www.googleapis.com/auth/analytics.readonly"]
    creds = service_account.Credentials.from_service_account_file(sa_path, scopes=scopes)
    return creds


def list_web_streams(creds):
    svc = build("analyticsadmin", "v1beta", credentials=creds, cache_discovery=False)
    # Get account summaries to enumerate properties accessible by this SA
    streams = []
    request = svc.accountSummaries().list(pageSize=200)
    while request is not None:
        resp = request.execute()
        for acc in resp.get("accountSummaries", []):
            for ps in acc.get("propertySummaries", []):
                prop_name = ps.get("property")  # like "properties/123456789"
                prop_display_name = ps.get("displayName")
                # List data streams for this property
                ds_req = svc.properties().dataStreams().list(parent=prop_name, pageSize=200)
                while ds_req is not None:
                    ds_resp = ds_req.execute()
                    for ds in ds_resp.get("dataStreams", []):
                        if ds.get("type") != "WEB_DATA_STREAM":
                            continue
                        web = ds.get("webStreamData", {})
                        streams.append({
                            "property": prop_name,
                            "propertyDisplayName": prop_display_name,
                            "dataStream": ds.get("name"),
                            "streamDisplayName": ds.get("displayName"),
                            "measurementId": web.get("measurementId"),
                            "defaultUri": web.get("defaultUri"),
                        })
                    ds_req = ds_resp.get("nextPageToken") and svc.properties().dataStreams().list(parent=prop_name, pageSize=200, pageToken=ds_resp["nextPageToken"]) or None
        request = resp.get("nextPageToken") and svc.accountSummaries().list(pageSize=200, pageToken=resp["nextPageToken"]) or None
    return streams


def host_from_url(url):
    try:
        return urlparse(url).hostname
    except Exception:
        return None


def main():
    sa_path = os.environ.get("GA_SA_JSON", "google-service-account.json")
    if not os.path.isfile(sa_path):
        raise SystemExit(f"Service account JSON not found: {sa_path}")
    creds = load_credentials(sa_path)
    streams = list_web_streams(creds)
    print(json.dumps({
        "count": len(streams),
        "streams": streams
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

