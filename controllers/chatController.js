exports.saveMessage = async (req, res) => {
    const { chatSessionId, senderId, content } = req.body;

    try {
        const message = new ChatMessage({
            chatSession: chatSessionId,
            sender: senderId,
            content: content
        });
        await message.save();
        res.status(201).json({ message: 'Message saved', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error: error.message });
    }
};
