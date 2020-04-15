/*
    From: https://leetcode.com/problems/design-twitter/ 
    Design a simplified version of Twitter where users can post tweets, 
    follow/unfollow another user and is able to see the 10 most recent tweets 
    in the user's news feed. 
    Your design should support the following methods:

    postTweet(userId, tweetId): Compose a new tweet.

    getNewsFeed(userId): Retrieve the 10 most recent tweet ids in the user's news feed. 
    Each item in the news feed must be posted by users who the user followed or by the user herself. 
    Tweets must be ordered from most recent to least recent.

    follow(followerId, followeeId): Follower follows a followee.

    unfollow(followerId, followeeId): Follower unfollows a followee.
*/

import { PriorityQueue, Tuple } from "./ts-heap";

const NEWS_FEED_SIZE = 10;

class Twitter {

    private users: Map<number, Set<number>>;
    private tweets: Map<number, Tweet>;
    private count: number;

    
    /** Initialize your data structure here. */
    constructor() {
        this.users = new Map();
        this.tweets = new Map();
        this.count = 0;
    }
    
    /** Compose a new tweet. */
    public postTweet(userId: number, tweetId: number) {
        if (!this.users.has(userId)) {
            this.users.set(userId, new Set());
        }
        this.users.get(userId)?.add(userId);
        if (!this.tweets.has(userId)) {
            this.tweets.set(userId, new Tweet(tweetId, this.count++));
        } else {
            this.tweets.get(userId)?.add(new Tweet(tweetId, this.count++));
        }
    }
    
    /** Retrieve the NEWS_FEED_SIZE most recent tweet ids in the user's news feed. 
        Each item in the news feed must be posted by users who the user followed or by the user herself. 
        Tweets must be ordered from most recent to least recent. 
    */
    public getNewsFeed(userId: number): Tweet | null {
        if (!this.users.has(userId)) {
            return null;
        }
        let result: Tweet;
        let allTweets: PriorityQueue<Tweet> = new PriorityQueue<Tweet>();
        let followees: Set<number> = this.users.get(userId)!;
        
        // add all followees tweets into allTweets
        followees.forEach(followee => {
            if (this.tweets.has(followee)) {
                let currFolloweeTweet: Tweet | null = this.tweets.get(followee)!;
                while (currFolloweeTweet != null) {
                    allTweets.insert(currFolloweeTweet, currFolloweeTweet.timestamp);
                    currFolloweeTweet = currFolloweeTweet.next;
                }
            }
        });

        // getting 10 most recent tweets from newsfeed
        let firstTweet: Tweet = allTweets.pop()!;
        result = new Tweet(firstTweet!.tweetId, firstTweet!.timestamp);
        let head = result;
        
        let counter = 1;
        while (counter < NEWS_FEED_SIZE && allTweets.size() > 0) {
            let currTweet: Tweet = allTweets.pop()!;
            let temp: Tweet = head;
            head = currTweet;
            head.next = temp;
        }

        return head;
    }
    
    /** Follower follows a followee. If the operation is invalid, it should be a no-op. */
    public follow(followerId: number, followeeId: number) {
        if (!this.users.has(followerId)) {
            this.users.set(followerId, new Set());
        }

        this.users.get(followerId)?.add(followeeId);
    }
    
    /** Follower unfollows a followee. If the operation is invalid, it should be a no-op. */
    public unfollow(followerId: number, followeeId: number) {
        if (this.users.has(followerId)) {
            this.users.get(followerId)?.delete(followeeId);
        }
    }

    public printUsers() {
        console.log(this.users);
    }

    public printTweets() {
        console.log(this.tweets);
    }
}

// you can store your tweet in a linked-list-esque timeline, feel free to 
// not use this data structure tho
class Tweet {
    public tweetId: number;
    public next: Tweet | null;
    public timestamp = 0;

    constructor(tweetId: number, timestamp: number) {
        this.tweetId = tweetId;
        this.next = null;
        this.timestamp = timestamp;
    }

    public add(newTweet: Tweet) {
        this.next = newTweet;
    }
}

// Your Twitter object will be instantiated and called as such:
let twitter: Twitter = new Twitter();

// User 1 posts a new tweet (id = 5).
twitter.postTweet(1, 5);

// User 1's news feed should return a list with 1 tweet id -> [5].
twitter.getNewsFeed(1);

// User 1 follows user 2.
twitter.follow(1, 2);

// User 2 posts a new tweet (id = 6).
twitter.postTweet(2, 6);

// User 1's news feed should return a list with 2 tweet ids -> [6, 5].
// Tweet id 6 should precede tweet id 5 because it is posted after tweet id 5.
twitter.getNewsFeed(1);

// User 1 unfollows user 2.
twitter.unfollow(1, 2);

// User 1's news feed should return a list with 1 tweet id -> [5],
// since user 1 is no longer following user 2.
twitter.getNewsFeed(1);
