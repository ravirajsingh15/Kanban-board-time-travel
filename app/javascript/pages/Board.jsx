import React, {
  useState,
  useEffect,
} from "react";

export default function Board() {

  const columns = [
    "Backlog",
    "To Do",
    "In Progress",
    "In Review",
    "Done",
  ];

  // CARDS STATE

  const [cards, setCards] =
    useState(() => {

      const savedCards =
        localStorage.getItem(
          "cards"
        );

      return savedCards
        ? JSON.parse(savedCards)
        : [
            {
              id: 1,
              title:
                "Fix Login Bug",
              description:
                "Authentication issue",
              column:
                "Backlog",
            },

            {
              id: 2,
              title:
                "Setup CI/CD",
              description:
                "Deploy pipeline",
              column:
                "To Do",
            },
          ];
    });

  // ACTIVITY STATE

  const [activities,
    setActivities] =
      useState(() => {

        const saved =
          localStorage.getItem(
            "activities"
          );

        return saved
          ? JSON.parse(saved)
          : [];
      });

  // FORM STATE

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  // EDIT STATE

  const [editingCardId,
    setEditingCardId] =
      useState(null);

  // SAVE TO LOCAL STORAGE

  useEffect(() => {

    localStorage.setItem(
      "cards",
      JSON.stringify(cards)
    );

  }, [cards]);

  useEffect(() => {

    localStorage.setItem(
      "activities",
      JSON.stringify(
        activities
      )
    );

  }, [activities]);

  // ADD CARD

  const addCard = () => {

    if (!title) return;

    const newCard = {
      id: Date.now(),

      title,

      description,

      column:
        "Backlog",
    };

    setCards([
      ...cards,
      newCard,
    ]);

    setActivities([
      `Card "${title}" created`,
      ...activities,
    ]);

    setTitle("");
    setDescription("");
  };

  // DELETE CARD

  const deleteCard =
    (cardId) => {

      const card =
        cards.find(
          (c) =>
            c.id === cardId
        );

      setCards(
        cards.filter(
          (card) =>
            card.id !==
            cardId
        )
      );

      setActivities([
        `Card "${card.title}" deleted`,
        ...activities,
      ]);
    };

  // START EDIT

  const startEdit =
    (card) => {

      setEditingCardId(
        card.id
      );

      setTitle(
        card.title
      );

      setDescription(
        card.description
      );
    };

  // SAVE EDIT

  const saveEdit = () => {

    const updatedCards =
      cards.map((card) => {

        if (
          card.id ===
          editingCardId
        ) {

          return {
            ...card,
            title,
            description,
          };
        }

        return card;
      });

    setCards(
      updatedCards
    );

    setActivities([
      `Card "${title}" updated`,
      ...activities,
    ]);

    setEditingCardId(
      null
    );

    setTitle("");
    setDescription("");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#f3f4f6",
        fontFamily:
          "Arial, sans-serif",
      }}
    >

      {/* MAIN BOARD */}

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "30px",
          }}
        >

          <h1
            style={{
              fontSize: "36px",
              fontWeight:
                "bold",
              color: "#111827",
            }}
          >
            Kanban Board
          </h1>

          <div
            style={{
              background:
                "#111827",
              color: "white",
              padding:
                "10px 16px",
              borderRadius:
                "10px",
              fontWeight:
                "bold",
            }}
          >
            {cards.length}
            {" "}
            Cards
          </div>

        </div>

        {/* FORM */}

        <div
          style={{
            background:
              "white",
            padding: "20px",
            borderRadius:
              "16px",
            marginBottom:
              "30px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
            display: "flex",
            gap: "12px",
          }}
        >

          <input
            type="text"
            placeholder="Card title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: "12px",
              borderRadius:
                "10px",
              border:
                "1px solid #d1d5db",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: "12px",
              borderRadius:
                "10px",
              border:
                "1px solid #d1d5db",
              outline: "none",
            }}
          />

          {editingCardId ? (

            <button
              onClick={
                saveEdit
              }
              style={{
                background:
                  "#16a34a",
                color: "white",
                border: "none",
                padding:
                  "12px 20px",
                borderRadius:
                  "10px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              Save
            </button>

          ) : (

            <button
              onClick={addCard}
              style={{
                background:
                  "#2563eb",
                color: "white",
                border: "none",
                padding:
                  "12px 20px",
                borderRadius:
                  "10px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              + Add Card
            </button>

          )}

        </div>

        {/* BOARD */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5, 1fr)",
            gap: "20px",
          }}
        >

          {columns.map(
            (column) => (

              <div
                key={column}

                style={{
                  background:
                    "white",

                  borderRadius:
                    "16px",

                  padding: "16px",

                  minHeight:
                    "500px",

                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >

                {/* COLUMN HEADER */}

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom:
                      "20px",
                  }}
                >

                  <h2
                    style={{
                      fontSize:
                        "20px",

                      fontWeight:
                        "bold",

                      color:
                        "#111827",
                    }}
                  >
                    {column}
                  </h2>

                  <span
                    style={{
                      background:
                        "#e5e7eb",

                      padding:
                        "4px 10px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "12px",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      cards.filter(
                        (
                          card
                        ) =>
                          card.column ===
                          column
                      ).length
                    }
                  </span>

                </div>

                {/* CARDS */}

                {cards
                  .filter(
                    (card) =>
                      card.column ===
                      column
                  )
                  .map(
                    (card) => (

                      <div
                        key={
                          card.id
                        }

                        style={{
                          background:
                            "#f9fafb",

                          border:
                            "1px solid #e5e7eb",

                          borderRadius:
                            "14px",

                          padding:
                            "14px",

                          marginBottom:
                            "14px",
                        }}
                      >

                        <h3
                          style={{
                            fontWeight:
                              "bold",

                            marginBottom:
                              "8px",

                            color:
                              "#111827",
                          }}
                        >
                          {
                            card.title
                          }
                        </h3>

                        <p
                          style={{
                            color:
                              "#6b7280",

                            fontSize:
                              "14px",

                            marginBottom:
                              "14px",
                          }}
                        >
                          {
                            card.description
                          }
                        </p>

                        <div
                          style={{
                            display:
                              "flex",
                            gap: "10px",
                          }}
                        >

                          <button
                            onClick={() =>
                              startEdit(
                                card
                              )
                            }

                            style={{
                              background:
                                "#2563eb",

                              color:
                                "white",

                              border:
                                "none",

                              padding:
                                "8px 12px",

                              borderRadius:
                                "8px",

                              cursor:
                                "pointer",

                              fontSize:
                                "13px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteCard(
                                card.id
                              )
                            }

                            style={{
                              background:
                                "#ef4444",

                              color:
                                "white",

                              border:
                                "none",

                              padding:
                                "8px 12px",

                              borderRadius:
                                "8px",

                              cursor:
                                "pointer",

                              fontSize:
                                "13px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    )
                  )}

              </div>

            )
          )}

        </div>

      </div>

      {/* ACTIVITY LOG */}

      <div
        style={{
          width: "340px",
          background: "white",
          padding: "24px",
          borderLeft:
            "1px solid #e5e7eb",
          boxShadow:
            "-2px 0 10px rgba(0,0,0,0.05)",
        }}
      >

        <h2
          style={{
            fontSize: "24px",
            fontWeight:
              "bold",
            marginBottom:
              "20px",
            color: "#111827",
          }}
        >
          Activity Log
        </h2>

        {activities.length ===
          0 && (

          <p
            style={{
              color:
                "#6b7280",
            }}
          >
            No activity yet
          </p>

        )}

        {activities.map(
          (
            activity,
            index
          ) => (

            <div
              key={index}

              style={{
                background:
                  "#f9fafb",

                padding:
                  "14px",

                borderRadius:
                  "12px",

                marginBottom:
                  "12px",

                border:
                  "1px solid #e5e7eb",
              }}
            >

              <p
                style={{
                  color:
                    "#374151",

                  fontSize:
                    "14px",

                  lineHeight:
                    "1.5",
                }}
              >
                {activity}
              </p>

            </div>

          )
        )}

      </div>

    </div>
  );
}