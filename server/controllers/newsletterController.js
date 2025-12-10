import NewsletterSubscription from '../models/NewsletterSubscription.js';

export const getNewsletterSubscriptions = async (req, res) => {
  try {
    const subscriptions = await NewsletterSubscription.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewsletterSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingSubscription = await NewsletterSubscription.findOne({ email });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    const subscription = new NewsletterSubscription({ email });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNewsletterSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await NewsletterSubscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await NewsletterSubscription.findByIdAndDelete(id);
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
