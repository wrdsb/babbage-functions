# Copy Blob from Flenderson
Copy a blob from Flenderson's storage account into Babbage's storage account.

Request JSON: 
```json
{
    "in_blob": {
        "path":"ipps",
        "name":"people-now-object.json"
    },
    "out_blob": {
        "path":"ipps",
        "name":"people-previous.json"
    }
}
```
