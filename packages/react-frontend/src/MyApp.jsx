import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
}, [] );



  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
}

  function removeOneCharacter(index) {
  const userToDelete = characters[index];

  fetch(`http://localhost:8000/users/${userToDelete.id}`, {
    method: "DELETE"
  })
    .then((response) => {
      if (response.status === 204) {
        setCharacters((prev) => prev.filter((_, i) => i !== index));
      } else if (response.status === 404) {
        console.log("User not found on the backend.");
      } else {
        console.log("Failed to delete user.");
      }
    })
    .catch((error) => {
      console.log("Error deleting user:", error);
    });
}

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) { 
  postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error("User not created");
    })
    .then((newUser) => {
      setCharacters((prev) => [...prev, newUser]);
    })
    .catch((error) => {
      console.log(error);
    });
}

  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
);

}

export default MyApp;
