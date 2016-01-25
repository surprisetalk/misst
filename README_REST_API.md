Misst REST API
==============
All responses from this API are in JSON. The defined response body will always have the given structure, even if an error has occured, though some of the response parameters may be null. If an error occurs, an error property will be included in the response body with "helpful" information on what went wrong.


Create Mixtape
--------------
### URLs
- POST /mixtape

### Request Body
Empty

### Response Body
- mixtapeId: Id of the new mixtape.


Retrieve Mixtape
----------------
### URLs
- GET /mixtape/:id
 - id: The id of the desired mixtape.

### Request Body
Empty

### Response Body
- mixtapeId: Equal to the requested id.
- tracks: An array of tracks as URL strings.


Insert Track
------------
### URLs
- POST /mixtape/:id
 - id: The id of the desired mixtape.

- POST /mixtape/:id/:index
 - id: The id of the desired mixtape.
 - index: The index where the track is to be inserted. index must be greater than or equal to 0 and less than or equal to the number of tracks in the given mixtape. Also see the request body parameter "index".

### Request Body
- index: The index where the track is to be inserted. index must be greater than or equal to 0 and less than or equal to the number of tracks in the given mixtape. The "index" parameter in the URL takes precedence over this one. If an index is not included in either the URL or the request body, then the new track is appended to the end of the mixtape's track list. See the URL parameter "index".
- link: The URL of the track being inserted.

### Response Body
- mixtapeId: Equal to the requested id.
- newTrack: Equal to the requested link.
- newTrackIndex: Equal to the index where the new track was inserted.


Remove Track
------------
### URLs
#### DELETE /mixtape/:id/:index
- id: The id of the desired mixtape.
- index: The index of the track to remove. index must be greater than or equal to 0 and less than the number of tracks in the given mixtape.

### Request Body
Empty

### Response Body
- mixtapeId: Equal to the requested id.
- removedTrackIndex: Equal to the requested index.
- newNumberOfTracks: The number of tracks in this mixtape after the given track was removed.