# Blob Copy from Flenderson
Copy a blob from Flenderson's storage account into Babbage's storage account, on demand. Typically run to replace the contents of a something-previous.json with those of the corresponding something-now.json after performing a differences/changes calculation in preparation for the next calculation.

Broken out into a separate function because we can't use "inout" bindings in JavaScript.

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
