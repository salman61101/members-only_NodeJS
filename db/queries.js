const pool = require("./pool");

// ---------- USERS ----------

async function createUser(
    firstName,
    lastName,
    username,
    password
) {
    await pool.query(
        `
        INSERT INTO users
        (first_name,last_name,username,password)
        VALUES ($1,$2,$3,$4)
        `,
        [
            firstName,
            lastName,
            username,
            password,
        ]
    );
}

async function updateUserMembershipStatus(userId, membershipStatus) {
    const { rows } = await pool.query(
        `
        UPDATE users
        SET membership_status = $1
        WHERE id = $2
        RETURNING *
        `,
        [membershipStatus, userId]
    );

    return rows[0];
}

async function updateUserAdminStatus(userId, isAdmin) {
    const { rows } = await pool.query(
        `
        UPDATE users
        SET is_admin = $1
        WHERE id = $2
        RETURNING *
        `,
        [isAdmin, userId]
    );

    return rows[0];
}

async function getUserByUsername(username) {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM users
        WHERE username=$1
        `,
        [username]
    );

    return rows[0];
}

async function getUserById(id) {

    const { rows } = await pool.query(

        `
        SELECT
            id,
            first_name,
            last_name,
            username,
            membership_status,
            is_admin
        FROM users
        WHERE id=$1
        `,

        [id]

    );

    return rows[0];

}

// ---------- MESSAGES ----------

async function getAllMessages() {
    const { rows } = await pool.query(
        `
        SELECT
            messages.id,
            messages.title,
            messages.text,
            messages.created_at,
            messages.user_id,
            users.first_name,
            users.last_name,
            users.username
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.created_at DESC, messages.id DESC
        `
    );

    return rows;
}

async function createMessage(title, text, userId) {
    const { rows } = await pool.query(
        `
        INSERT INTO messages (title, text, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [title, text, userId]
    );

    return rows[0];
}

async function deleteMessageById(messageId) {
    await pool.query(
        `
        DELETE FROM messages
        WHERE id = $1
        `,
        [messageId]
    );
}

module.exports = {

    createUser,

    updateUserMembershipStatus,

    updateUserAdminStatus,

    getUserByUsername,

    getUserById,

    getAllMessages,

    createMessage,

    deleteMessageById,

};