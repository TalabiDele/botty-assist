# Broadcast Messages Guide

## 🎯 What is Broadcasting?

Broadcasting allows you to send recurring or one-time messages to **multiple
people or groups** automatically. Perfect for:

- 📢 Team announcements
- 🎂 Birthday reminders to multiple groups
- 📊 Weekly report reminders
- 💪 Daily motivation messages
- 🏃 Workout reminders to gym buddies

## 🆕 New Commands

### 1. `!broadcast` - Recurring Broadcasts

Send the same message regularly to multiple chats.

**Syntax:**

```
!broadcast <message> <frequency> at <time> to <chat1>, <chat2>, ...
```

**Examples:**

```
Daily good morning to work teams:
!broadcast Good morning team! 🌅 daily at 08:00 to Engineering Team, Sales Team

Weekly report reminder:
!broadcast Time for weekly reports 📊 weekly at Monday 16:00 to Boss, Manager, Team Lead

Gym reminder to multiple friends:
!broadcast Gym time! 💪 every Mon,Wed,Fri at 18:00 to John, Mike, Fitness Group

Monthly rent reminder:
!broadcast Rent is due soon 🏠 monthly at 1st 09:00 to Roommate1, Roommate2
```

### 2. `!broadcast-once` - One-Time Broadcasts

Send a scheduled message once to multiple chats.

**Syntax:**

```
!broadcast-once <message> at <date/time> to <chat1>, <chat2>, ...
```

**Examples:**

```
Party invitation:
!broadcast-once Party at my place tonight! 🎉 at 2024-12-25 18:00 to Sarah, John, Mike, Emma

Meeting reminder:
!broadcast-once Meeting in 1 hour ⏰ at 2024-12-20 14:00 to Team A, Team B, Manager

Birthday wishes:
!broadcast-once Happy Birthday! 🎂 at 2025-01-15 00:00 to Birthday Group, Close Friends
```

### 3. `!chats` - List Available Chats

Find the exact names of your contacts and groups.

**Syntax:**

```
!chats              # List all chats
!chats <search>     # Search for specific chat
```

**Examples:**

```
List all:
!chats

Search for work chats:
!chats engineering

Find a person:
!chats john
```

## 📋 Step-by-Step Tutorial

### Example 1: Daily Team Standup Reminder

**Goal:** Send "Standup time!" every day at 9 AM to two work groups

**Steps:**

1. **Find your team chat names:**

   ```
   !chats team
   ```

   Response:

   ```
   📁 Groups:
   1. Engineering Team
   2. Sales Team
   3. Marketing Team
   ```

2. **Create the broadcast:**

   ```
   !broadcast Standup time! 🚀 daily at 09:00 to Engineering Team, Sales Team
   ```

3. **Bot confirms:**

   ```
   ✅ Broadcast reminder set!
   📌 Reminder ID: 1
   💬 Message: Standup time! 🚀
   🔄 Frequency: daily
   ⏰ Time: 09:00
   📤 Sending to:
   • Engineering Team 📁
   • Sales Team 📁
   ```

4. **Every day at 9 AM,** both groups receive:

   ```
   📢 BROADCAST MESSAGE

   Standup time! 🚀
   ```

### Example 2: Weekend Plans with Friends

**Goal:** Ask about weekend plans every Friday at 5 PM to your friend group

**Steps:**

1. **Create the broadcast:**

   ```
   !broadcast Any plans for the weekend? 🎉 weekly at Friday 17:00 to Weekend Squad
   ```

2. **Every Friday at 5 PM,** the group receives the message automatically.

### Example 3: Birthday Reminder

**Goal:** Send birthday wishes at midnight to multiple groups

**Steps:**

1. **Schedule one-time broadcast:**

   ```
   !broadcast-once Happy Birthday Sarah! 🎂🎉 at 2025-01-15 00:00 to Close Friends, Family Group, Work Friends
   ```

2. **At midnight on Jan 15,** all three chats receive the message.

## 🎯 Use Cases

### Personal Life

**Daily Motivation:**

```
!broadcast You've got this! 💪 daily at 07:00 to Gym Buddy, Best Friend, Accountability Partner
```

**Weekly Check-ins:**

```
!broadcast How was your week? 😊 weekly at Friday 20:00 to Mom, Dad, Sister
```

**Monthly Bill Reminders:**

```
!broadcast Bills are due! 💳 monthly at 25th 10:00 to Roommate
```

### Work/Business

**Daily Standups:**

```
!broadcast Standup in 10 minutes! daily at 09:50 to Dev Team, QA Team, Product Team
```

**Weekly Reports:**

```
!broadcast Weekly report deadline today! 📊 weekly at Monday 09:00 to All Teams
```

**Sprint Planning:**

```
!broadcast-once Sprint planning starts now at 2024-12-20 10:00 to Scrum Team, Product Owner, Stakeholders
```

### Events

**Event Countdown:**

```
!broadcast Conference in 3 days! 🎤 every Mon,Wed,Fri at 10:00 to Attendee List
```

**Meetup Reminder:**

```
!broadcast Monthly meetup tomorrow! weekly at 3rd Thursday 18:00 to Tech Meetup Group
```

## 💡 Pro Tips

### 1. Use Descriptive Names

```
✅ Good: !broadcast Team standup daily at 09:00 to Engineering Team
❌ Bad: !broadcast hi daily at 09:00 to Eng
```

### 2. Check Chat Names First

```
Always run !chats to see exact names before broadcasting
```

### 3. Test with One Chat First

```
!broadcast-once Test message at 2024-12-20 10:05 to Saved Messages
```

### 4. Be Mindful of Time Zones

```
The bot uses your computer's time zone
```

### 5. Add Context to Messages

```
✅ Good: !broadcast Standup time! Please join Zoom 🚀
❌ Bad: !broadcast standup
```

### 6. Use Emojis for Clarity

```
💪 Fitness reminders
📊 Work reports
🎉 Social events
⏰ Time-sensitive messages
📢 Announcements
```

## 🔐 Privacy & Etiquette

### ⚠️ Important Considerations

**1. Recipient Awareness**

- Recipients see messages as coming from YOU
- They don't know it's automated
- Be transparent if asked

**2. Message Frequency**

- Don't spam: Be reasonable with frequency
- Consider time zones of recipients
- Avoid late night/early morning unless agreed

**3. Group Broadcasts**

- Everyone in the group sees the message
- Public announcements only
- Avoid personal info in group broadcasts

**4. Permission**

- Only broadcast to people/groups who expect it
- Don't use for unsolicited messages
- Respect boundaries

### ✅ Best Practices

**Professional:**

```
✅ Broadcast work reminders to work groups
✅ Keep messages relevant and brief
✅ Schedule during work hours
```

**Personal:**

```
✅ Fun messages to close friend groups
✅ Coordinate with recipients first
✅ Stop if someone asks
```

## 🛠️ Management

### View All Broadcasts

```
!list
```

Shows all reminders including broadcasts with target chats.

### Cancel a Broadcast

```
!cancel 1
```

Stops the broadcast with ID 1.

### Modify a Broadcast

Cancel the old one and create a new one:

```
!cancel 1
!broadcast New message daily at 10:00 to Team
```

## 📊 Broadcast vs Regular Reminders

| Feature        | Regular Reminder  | Broadcast              |
| -------------- | ----------------- | ---------------------- |
| **Target**     | Current chat only | Multiple chats         |
| **Setup**      | `!remind`         | `!broadcast`           |
| **Use Case**   | Personal tasks    | Team coordination      |
| **Recipients** | Just you          | Multiple people/groups |
| **Example**    | Buy milk          | Team standup           |

## 🎓 Advanced Examples

### Morning Routine Broadcast

```
!broadcast Time to start the day! ☀️
• Meditation ✅
• Exercise ✅
• Healthy breakfast ✅
daily at 06:00 to Accountability Group, Gym Buddy
```

### Weekly Team Sync

```
!broadcast 📅 Team Sync Agenda:
1. Last week's wins
2. This week's goals
3. Blockers
weekly at Monday 10:00 to Dev Team, QA Team
```

### Multiple Time Zones

```
If teams are in different time zones, create separate broadcasts:

!broadcast Morning standup! daily at 09:00 to US Team
!broadcast Afternoon standup! daily at 17:00 to EU Team
```

### Event Series

```
!broadcast Webinar in 1 week! 📺 at 2024-12-13 10:00 to Attendees
!broadcast Webinar in 3 days! 📺 at 2024-12-17 10:00 to Attendees
!broadcast Webinar tomorrow! 📺 at 2024-12-19 10:00 to Attendees
!broadcast Webinar starting now! 📺 at 2024-12-20 10:00 to Attendees
```

## ❓ FAQ

**Q: Can recipients see it's automated?** A: No, it appears as a regular message
from you.

**Q: What if a chat name has special characters?** A: Use the exact name shown
in `!chats`. The bot handles special characters.

**Q: Can I broadcast to someone not in my contacts?** A: No, you need an
existing chat with them.

**Q: How many chats can I broadcast to at once?** A: No hard limit, but there's
a 1-second delay between each to avoid rate limiting.

**Q: Can I schedule broadcasts months in advance?** A: Yes! Use
`!broadcast-once` with future dates.

**Q: What if someone blocks me?** A: The broadcast will fail for that person but
continue for others.

**Q: Can I see who received the message?** A: No, but you'll see any delivery
errors in the logs.

**Q: Do I need permission from recipients?** A: Technically no, but ethically
yes. Get consent for regular broadcasts.

## 🆘 Troubleshooting

**"Could not find chat/group"**

- Run `!chats` to see available chats
- Check spelling and capitalization
- Make sure you have an existing conversation

**"Multiple matches found"**

- Use more specific names
- Include more of the contact name
- Check the list and choose exact match

**Broadcast not sending**

- Check bot is still running
- Verify computer isn't in sleep mode
- Check reminder with `!list`

**Rate limiting**

- Bot adds 1-second delay between messages
- If still hitting limits, reduce number of recipients

## 🎉 Summary

Broadcasts are perfect for:

- ✅ Regular team updates
- ✅ Group coordination
- ✅ Event reminders
- ✅ Motivation messages
- ✅ Any recurring communication to multiple people

Use responsibly and ethically! 🙌
