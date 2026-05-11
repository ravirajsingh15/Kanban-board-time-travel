export default function Card({
  card,
  onDelete,
}) {

  return (
    <div
      style={{
        border:
          "1px solid black",

        borderRadius:
          "8px",

        marginBottom:
          "10px",

        padding: "10px",

        background:
          "#f9fafb",
      }}
    >

      <h3
        style={{
          fontWeight:
            "bold",
        }}
      >
        {card.title}
      </h3>

      <p>
        {card.description}
      </p>

      <button
        onClick={() =>
          onDelete(card.id)
        }
        style={{
          marginTop: "10px",
          background: "red",
          color: "white",
          border: "none",
          padding:
            "5px 10px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>

    </div>
  );
}