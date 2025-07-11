%%{init: {'theme':'default'}}%%
erDiagram
    ADMIN {
        string _id PK
        string username
        string password
        string name
        string email
        string role
        string status
        datetime createdAt
        datetime updatedAt
    }
    USER {
        string _id PK
        string username
        string password
        string name
        string email
        string phone
        string role
        string status
        datetime createdAt
        datetime updatedAt
    }
    VOLUNTEER {
        string _id PK
        string name
        string email
        string phone
        string volunteerType
        string availability
        string experience
        string message
        string status
        datetime submittedAt
        datetime createdAt
        datetime updatedAt
    }
    RESCUE_SUBMISSION {
        string _id PK
        string name
        string breed
        string gender
        string age
        string size
        string location
        string description
        string contactName
        string contactEmail
        string contactPhone
        string imageUrls[]
        string status
        string statusNotes
        datetime submittedAt
    }
    DOG {
        string _id PK
        string name
        string breed
        string age
        string size
        string gender
        string image
        string description
        string tags[]
        string status
        datetime createdAt
        datetime updatedAt
    }
    APPLICATION {
        string _id PK
        string status
        string applicationNotes
        string adminNotes
        datetime submittedAt
        datetime updatedAt
    }

    USER ||--o{ APPLICATION : submits
    DOG  ||--o{ APPLICATION : "applied for"
    USER ||--o{ RESCUE_SUBMISSION : reports
    RESCUE_SUBMISSION ||--|| DOG : "creates (rescued)"