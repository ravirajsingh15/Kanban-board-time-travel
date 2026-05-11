import React, {
  useState,
  useEffect,
} from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function Board() {

  const columns = [
    "Backlog",
    "To Do",
    "In Progress",
    "In Review",
    "Done",
  ];

  const [cards, setCards] =
    useState([]);

  const [activities,
    setActivities] =
      useState([]);

  const [timelineIndex,
    setTimelineIndex] =
      useState(null);

  const [readonly,
    setReadonly] =
      useState(false);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [editingCardId,
    setEditingCardId] =
      useState(null);

  // FETCH INITIAL DATA

  useEffect(() => {

    fetchCards();
    fetchActivities();

  }, []);

  // FETCH CARDS

  const fetchCards =
    async () => {

      const response =
        await fetch(
          "/cards"
        );

      const data =
        await response.json();

      setCards(data);
    };

  // FETCH ACTIVITIES

  const fetchActivities =
    async () => {

      const response =
        await fetch(
          "/events"
        );

      const data =
        await response.json();

      setActivities(data);
    };

  // ADD CARD

  const addCard =
    async () => {

      if (!title)
        return;

      await fetch(
        "/cards",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              title,
              description,
            }),
        }
      );

      await fetchCards();

      await fetchActivities();

      setTitle("");

      setDescription("");
    };

  // DELETE CARD

  const deleteCard =
    async (id) => {

      await fetch(
        `/cards/${id}`,
        {
          method:
            "DELETE",
        }
      );

      await fetchCards();

      await fetchActivities();
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

  const saveEdit =
    async () => {

      const currentCard =
        cards.find(
          (card) =>
            card.id ===
            editingCardId
        );

      await fetch(
        `/cards/${editingCardId}`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              title,
              description,

              column:
                currentCard.column,
            }),
        }
      );

      await fetchCards();

      await fetchActivities();

      setEditingCardId(
        null
      );

      setTitle("");

      setDescription("");
    };

  // DRAG DROP

  const onDragEnd =
    async (
      result
    ) => {

      if (
        !result.destination
      ) return;

      if (readonly)
        return;

      const {
        destination,
      } = result;

      const destinationColumn =
        destination.droppableId;

      const movedCard =
        cards.find(
          (card) =>
            card.id.toString() ===
            result.draggableId
        );

      await fetch(
        `/cards/${movedCard.id}`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              title:
                movedCard.title,

              description:
                movedCard.description,

              column:
                destinationColumn,
            }),
        }
      );

      await fetchCards();

      await fetchActivities();
    };

  // TIMELINE

  const handleTimeline =
    async (e) => {

      const index =
        Number(
          e.target.value
        );

      setTimelineIndex(
        index
      );

      setReadonly(true);

      const activity =
        activities[index];

      if (!activity)
        return;

      const response =
        await fetch(
          `/timeline?timestamp=${activity.occurred_at}`
        );

      const data =
        await response.json();

      setCards(data);
    };

  // BACK TO LIVE

  const backToLive =
    async () => {

      await fetchCards();

      setReadonly(false);

      setTimelineIndex(
        null
      );
    };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#f3f4f6",
        fontFamily:
          "Arial",
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
              "20px",
          }}
        >

          <h1
            style={{
              fontSize:
                "42px",

              fontWeight:
                "bold",

              background:
                "linear-gradient(135deg, #2563eb, #1d4ed8)",

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",

              letterSpacing:
                "1px",

              marginBottom:
                "10px",

              textShadow:
                "0 2px 10px rgba(37,99,235,0.15)",
            }}
          >
            🚀 Kanban Board Time Travel
          </h1>

          {readonly && (

            <div
              style={{
                background:
                  "#2563eb",

                color:
                  "white",

                padding:
                  "10px 16px",

                borderRadius:
                  "10px",

                fontWeight:
                  "bold",
              }}
            >
              Historical View
            </div>

          )}

        </div>

        {/* TIMELINE */}

        {activities.length > 0 && (

          <div
            style={{
              background:
                "white",

              padding:
                "20px",

              borderRadius:
                "16px",

              marginBottom:
                "20px",
            }}
          >

            <input
              type="range"

              min="0"

              max={
                activities.length -
                1
              }

              value={
                timelineIndex ?? 0
              }

              onChange={
                handleTimeline
              }

              style={{
                width: "100%",
              }}
            />

            <div
              style={{
                marginTop:
                  "12px",

                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",
              }}
            >

              <span
                style={{
                  color:
                    "#6b7280",

                  fontSize:
                    "14px",
                }}
              >
                Timeline:
                {" "}

                {
                  activities[
                    timelineIndex ?? 0
                  ]?.occurred_at &&
                  new Date(
                    activities[
                      timelineIndex ?? 0
                    ].occurred_at
                  ).toLocaleString()
                }

              </span>

            </div>

            {readonly && (

              <button
                onClick={
                  backToLive
                }

                style={{
                  marginTop:
                    "15px",

                  padding:
                    "10px 20px",

                  background:
                    "#2563eb",

                  color:
                    "white",

                  border:
                    "none",

                  borderRadius:
                    "8px",

                  cursor:
                    "pointer",
                }}
              >
                Back To Live
              </button>

            )}

          </div>

        )}

        {/* FORM */}

        {!readonly && (

          <div
            style={{
              background:
                "white",

              padding:
                "20px",

              borderRadius:
                "16px",

              marginBottom:
                "30px",

              display:
                "flex",

              gap: "10px",
            }}
          >

            <input
              type="text"

              placeholder="Title"

              value={title}

              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }

              style={{
                flex: 1,
                padding:
                  "12px",

                border:
                  "1px solid #ddd",

                borderRadius:
                  "8px",
              }}
            />

            <input
              type="text"

              placeholder="Description"

              value={
                description
              }

              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }

              style={{
                flex: 1,
                padding:
                  "12px",

                border:
                  "1px solid #ddd",

                borderRadius:
                  "8px",
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

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "12px 20px",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",
                }}
              >
                Save
              </button>

            ) : (

              <button
                onClick={
                  addCard
                }

                style={{
                  background:
                    "#2563eb",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "12px 20px",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",
                }}
              >
                Add Card
              </button>

            )}

          </div>

        )}

        {/* BOARD */}

        <DragDropContext
          onDragEnd={
            onDragEnd
          }
        >

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

                <Droppable
                  droppableId={
                    column
                  }

                  key={column}
                >

                  {(provided) => (

                    <div
                      ref={
                        provided.innerRef
                      }

                      {...provided.droppableProps}

                      style={{
                        background:
                          "white",

                        borderRadius:
                          "16px",

                        padding:
                          "15px",

                        minHeight:
                          "500px",
                      }}
                    >

                      <h2
                        style={{
                          marginBottom:
                            "18px",

                          background:
                            "linear-gradient(135deg, #2563eb, #1d4ed8)",

                          color:
                            "white",

                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",

                          padding:
                            "12px 16px",

                          borderRadius:
                            "12px",

                          fontSize:
                            "18px",

                          fontWeight:
                            "bold",

                          boxShadow:
                            "0 4px 10px rgba(37,99,235,0.25)",
                        }}
                      >

                      <span>
                        {column}
                      </span>

                      <span
                        style={{
                          background:
                            "rgba(255,255,255,0.2)",

                          padding:
                            "4px 10px",

                          borderRadius:
                            "999px",

                          fontSize:
                            "13px",
                        }}
                      >
                        {
                          cards.filter(
                            (card) =>
                              card.column ===
                              column
                          ).length
                        }
                      </span>

                    </h2>

                      {cards
                        .filter(
                          (
                            card
                          ) =>
                            card.column ===
                            column
                        )
                        .map(
                          (
                            card,
                            index
                          ) => (

                            <Draggable
                              key={
                                card.id
                              }

                              draggableId={
                                card.id.toString()
                              }

                              index={
                                index
                              }
                            >

                              {(
                                provided
                              ) => (

                                <div
                                  ref={
                                    provided.innerRef
                                  }

                                  {...provided.draggableProps}

                                  {...provided.dragHandleProps}

                                  style={{
                                    background:
                                      "#f9fafb",

                                    padding:
                                      "14px",

                                    borderRadius:
                                      "10px",

                                    marginBottom:
                                      "12px",

                                    border:
                                      "1px solid #eee",

                                    ...provided
                                      .draggableProps
                                      .style,
                                  }}
                                >

                                  <h3
                                    style={{
                                      marginBottom:
                                        "8px",
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
                                    }}
                                  >
                                    {
                                      card.description
                                    }
                                  </p>

                                  {!readonly && (

                                    <div
                                      style={{
                                        display:
                                          "flex",

                                        gap:
                                          "10px",

                                        marginTop:
                                          "14px",
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
                                        }}
                                      >
                                        Delete
                                      </button>

                                    </div>

                                  )}

                                </div>

                              )}

                            </Draggable>

                          )
                        )}

                      {
                        provided.placeholder
                      }

                    </div>

                  )}

                </Droppable>

              )
            )}

          </div>

        </DragDropContext>

      </div>

      {/* ACTIVITY LOG */}

      <div
        style={{
          width: "340px",

          background:
            "white",

          padding:
            "24px",

          borderLeft:
            "1px solid #ddd",
        }}
      >

        <div
          style={{
            background:
              "#2563eb",

            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            color:
              "white",

            padding:
              "10px 16px",

            borderRadius:
              "10px",

            fontWeight:
              "bold",
            marginBottom:
              "10px"
          }}
        >
         Activity Logs
        </div>

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

                marginBottom:
                  "12px",

                borderRadius:
                  "10px",

                border:
                  "1px solid #eee",
              }}
            >

              <p>

                {activity.event_type ===
                  "moved" ? (

                  <>
                    Card "
                    {
                      activity.data
                        ?.title
                    }"
                    {" "}
                    moved from
                    {" "}
                    {
                      activity.data
                        ?.from_column
                    }
                    {" "}
                    to
                    {" "}
                    {
                      activity.data
                        ?.to_column
                    }
                  </>

                ) : (

                  <>
                    Card "
                    {
                      activity.data
                        ?.title
                    }"
                    {" "}
                    {
                      activity.event_type
                    }
                  </>

                )}

              </p>

            </div>

          )
        )}

      </div>

    </div>
  );
}