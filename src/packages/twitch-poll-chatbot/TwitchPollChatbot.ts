import { EventEmitter } from "events";
import { Client, Events } from "tmi.js";
import TypedEmitter from "typed-emitter";

export class TwitchPollChatbot {
  events: TypedEmitter<TwitchPollChatbotEvents> = new EventEmitter();
  private votesPerUser: Record<string, number> = {};
  private answers: string[] = [];

  get votesPerAnswerIndex() {
    const sums = Object.values(this.votesPerUser).reduce(
      (sums, index) => ({ ...sums, [index]: (sums[index] || 0) + 1 }),
      {} as Record<number, number>
    );
    return this.answers.map((a, index) => sums[index] || 0);
  }

  private get orderedVotes() {
    return this.votesPerAnswerIndex
      .map((count, index) => ({
        count,
        index,
      }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count);
  }

  get winningVotes() {
    const topVote = this.orderedVotes[0];
    const winning = topVote ? [topVote] : [];
    for (const vote of this.orderedVotes.slice(1)) {
      if (vote.count === topVote.count) {
        winning.push(vote);
      } else {
        break;
      }
    }
    return winning;
  }

  private get needsTieBreaker() {
    return this.winningVotes.length !== 1;
  }

  constructor(private options: TwitchPollChatboxOptions) {}

  attach(client: Client) {
    client.on("message", this.onMessage);
  }

  detach(client: Client) {
    client.removeListener("message", this.onMessage);
  }

  poll(question: string, answers: string[]) {
    if (!answers.length) {
      throw new Error("Can't start a poll without answers");
    }

    // Reset votes and remember answers
    this.answers = answers;
    this.votesPerUser = {};
  }

  determineWinner() {
    // Determine top vote or pick randomly
    const useTieBreaker = this.needsTieBreaker;
    const selectedIndex = useTieBreaker
      ? this.options.tieBreaker(this)
      : this.winningVotes[0].index;

    // Reset votes when a winner has been determined
    this.votesPerUser = {};

    return selectedIndex;
  }

  private vote(answerIndex: number, username: string) {
    if (answerIndex >= 0 && answerIndex < this.votesPerAnswerIndex.length) {
      this.votesPerUser[username] = answerIndex;
      this.events.emit("vote", answerIndex);
    }
  }

  private onMessage: Events["message"] = (
    channel,
    userState,
    message,
    self
  ) => {
    // Ignore echoed messages.
    if (self) {
      return;
    }
    const voteIndex = this.options.parseVote(message);
    if (userState.username && voteIndex !== undefined) {
      this.vote(voteIndex, userState.username);
    }
  };
}

export type TwitchPollChatboxOptions = {
  parseVote: (message: string) => number | undefined;
  tieBreaker: (bot: TwitchPollChatbot) => number;
};

export type TwitchPollChatbotEvents = {
  vote: (answerIndex: number) => void;
};
