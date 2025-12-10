import ContactSubmission from '../models/ContactSubmission.js';

export const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContactSubmission = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, city } = req.body;

    if (!fullName || !email || !mobileNumber || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const submission = new ContactSubmission({
      fullName,
      email,
      mobileNumber,
      city,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    await ContactSubmission.findByIdAndDelete(id);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
