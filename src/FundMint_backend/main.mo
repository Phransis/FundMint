import Time "mo:base/Time";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Int "mo:base/Int";

actor Fundmint {

  type Campaign = {
    id : Nat;
    owner : Principal;
    title : Text;
    description : Text;
    target : Nat;
    raised : Nat;
    deadline : Time.Time;
    contributors : [Principal];
    milestones : [Milestone];
    isClosed : Bool;
    timestamp: Time.Time;
  };

  type Milestone = {
    title : Text;
    description : Text;
    target : Nat;
    deadline : Time.Time;
    isReleased : Bool;
  };

  type Contribution = {
    id : Nat;
    campaignId : Nat;
    contributor : Principal;
    amount : Nat;
    timestamp : Time.Time;
    refund : Bool;
  };

  stable var campaigns : [Campaign] = [];
  stable var contributions : [Contribution] = [];

  /// Helper function to find a campaign by ID
  func findCampaign(campaignId: Nat) : ?Campaign {
    return Array.find<Campaign>(campaigns, func(c) { c.id == campaignId });
  };

  public shared(msg) func createCampaign(
    title: Text, description: Text, target: Nat, deadline: Time.Time, milestones: [Milestone]
  ) : async Text {
    let owner = msg.caller;
    let newId = Array.size(campaigns) + 1;

    if (target == 0) {
      throw Error.reject("Campaign target cannot be zero.");
    };

    if (deadline <= Time.now()/1_000_000_000) {
      throw Error.reject("Campaign deadline must be in the future.");
    };

    // if (Array.size(milestones) == 0) {
    //   throw Error.reject("Campaign must have at least one milestone.");
    // };


    
    let newCampaign : Campaign = {
      id = newId;
      owner = owner;
      title = title;
      description = description;
      target = target;
      raised = 0;
      deadline = deadline;
      contributors = [];
      milestones = milestones;
      isClosed = false;
      timestamp = Time.now();
    };
    
    campaigns := Array.append<Campaign>(campaigns, [newCampaign]);
    return "Campaign '" # newCampaign.title # "' created successfully!";
  };

public shared(msg) func contribute(campaignId: Nat, amount: Nat) : async Text {
  let campaignOpt = findCampaign(campaignId);

  switch (campaignOpt) {
    case (null) { throw Error.reject("Campaign not found"); };
    case (?campaign) {
      let currentTime = Time.now() / 1_000_000_000; // Convert nanoseconds to seconds
      let balance : Nat = campaign.target-campaign.raised;

      // ✅ Check if the campaign should be closed
      let shouldClose = (currentTime > campaign.deadline) or (balance == 0);

      if (shouldClose) {
        let updatedCampaign = { campaign with isClosed = true };

        campaigns := Array.map<Campaign, Campaign>(campaigns, func(c: Campaign) : Campaign {
          if (c.id == campaignId) { updatedCampaign } else { c }
        });

        throw Error.reject("Campaign is closed. Cannot contribute.");
      };

      if (amount == 0) {
        throw Error.reject("Contribution amount cannot be zero.");
      };

      if (campaign.raised + amount > campaign.target) {
        throw Error.reject("Contribution amount exceeds campaign target.");
      };

      let user = msg.caller;
      let newContributionId = Array.size(contributions) + 1;

      let contribution : Contribution = {
        id = newContributionId;
        campaignId = campaign.id;
        contributor = user;
        amount = amount;
        timestamp = Time.now();
        refund = false;
      };

      contributions := Array.append<Contribution>(contributions, [contribution]);

      // ✅ Update campaign state
      let newRaised = campaign.raised + amount;
      let newIsClosed = (newRaised >= campaign.target) or (currentTime > campaign.deadline); // Close if target or deadline is reached

      let updatedCampaign = { campaign with 
        raised = newRaised;
        isClosed = newIsClosed;
        contributors = if (Array.find<Principal>(campaign.contributors, func(c) { c == user }) == null) {
          Array.append<Principal>(campaign.contributors, [user])
        } else { campaign.contributors }
      };

      // ✅ Persist the updated campaign
      campaigns := Array.map<Campaign, Campaign>(campaigns, func(c: Campaign) : Campaign {
        if (c.id == campaignId) { updatedCampaign } else { c }
      });

      return "Contribution of " # Nat.toText(amount) # " added successfully!";
    }
  }
};


  public shared(msg) func closeCampaign(campaignId: Nat) : async Text {
    let campaignOpt = findCampaign(campaignId);

    switch (campaignOpt) {
      case (null) { throw Error.reject("Campaign not found"); };
      case (?campaign) {
        if (msg.caller != campaign.owner) {
          throw Error.reject("Unauthorized: Only the owner can close the campaign.");
        };

        if (campaign.raised < campaign.target) {
          throw Error.reject("Campaign target not met. Cannot close.");
        };

        let updatedCampaign = { campaign with isClosed = true };

        campaigns := Array.map<Campaign, Campaign>(campaigns, func(c: Campaign) : Campaign {
          if (c.id == campaignId) { updatedCampaign } else { c }
        });

        return "Campaign closed successfully!";
      }
    }
  };

  public query func getCampaigns() : async [Campaign] {
    return campaigns;
  };

  public query func getCampaignById(campaignId: Nat) : async ?Campaign {
    return findCampaign(campaignId);
  };

  public query func getAllContributors(campaignId: Nat) : async ?[Principal] {
    let campaignOpt = findCampaign(campaignId);
    switch (campaignOpt) {
      case (?campaign) { ?campaign.contributors };
      case (null) { null };
    }
  };

  public query func getOwnerCampaigns(owner: Principal) : async [Campaign] {
    return Array.filter<Campaign>(campaigns, func(c) { c.owner == owner });
  };

  public shared(msg) func selfCloseCampaign(campaignId: Nat) : async Text {
    let campaignOpt = findCampaign(campaignId);

    switch (campaignOpt) {
      case (null) { throw Error.reject("Campaign not found"); };
      case (?campaign) {
        if (msg.caller != campaign.owner) {
          throw Error.reject("Unauthorized: Only the owner can close this campaign.");
        };

        let updatedCampaign = { campaign with isClosed = true };

        campaigns := Array.map<Campaign, Campaign>(campaigns, func(c: Campaign) : Campaign {
          if (c.id == campaignId) { updatedCampaign } else { c }
        });

        return "Campaign closed successfully!";
      }
    }
  };

   public shared(msg) func updateCampaign(
    campaignId: Nat, title: Text, description: Text, target: Nat, deadline: Time.Time, milestones: [Milestone]
  ) : async Text {
    let campaignOpt = findCampaign(campaignId);
    
    switch (campaignOpt) {
      case (null) { throw Error.reject("Campaign not found"); };
      case (?campaign) {
        if (msg.caller != campaign.owner) {
          throw Error.reject("Unauthorized: Only the owner can update the campaign.");
        };

        let updatedCampaign : Campaign = {
          id = campaign.id;
          owner = campaign.owner;
          title = title;
          description = description;
          target = target;
          raised = campaign.raised;
          deadline = deadline;
          // deadline = Time.now() + deadline;
          contributors = campaign.contributors;
          milestones = milestones;
          isClosed = campaign.isClosed;
          timestamp = Time.now();
        };

        campaigns := Array.map<Campaign, Campaign>(campaigns, func(c) {
          if (c.id == campaignId) { updatedCampaign } else { c }
        });

        return "Campaign updated successfully!";
      }
    }
  };

  public func getAllContributions(campaignId: Nat) : async ?[Contribution] {
    let campaignOpt = findCampaign(campaignId);
    switch (campaignOpt) {
      case (?campaign) {
        let campaignContributions = Array.filter<Contribution>(contributions, func(c) { c.campaignId == campaignId });
        return ?campaignContributions;
      };
      case (null) { return null; };
    }
  };

  public func getContributionsByUser(user: Principal) : async ?[Contribution] {
    let userContributions = Array.filter<Contribution>(contributions, func(c) { c.contributor == user });
    return ?userContributions;
  };

  // public func getContributionsByCampaignAndUser(campaignId: Nat, user: Principal) : async ?[Contribution] {
  //   let campaignContributions = Array.filter<Contribution>(contributions, func(c) { c.campaignId == campaignId && c.contributor == user });
  //   return ?campaignContributions;
  // };

  public func getContributionsByCampaign(campaignId: Nat) : async ?[Contribution] {
    let campaignContributions = Array.filter<Contribution>(contributions, func(c) { c.campaignId == campaignId });
    return ?campaignContributions;
  };

  // public func checkContributionExists(campaignId: Nat, user: Principal) : async Bool {
  //   let campaignContributions = Array.filter<Contribution>(contributions, func(c) { c.campaignId == campaignId && c.contributor == user });
  //   return Array.size(campaignContributions) > 0;
  // };
  

  public func getFirstContribution(contributionId: Nat) :async ?Contribution {
    return Array.find<Contribution>(contributions, func(c) { c.id == contributionId });
  };


  public func getWeekFromToday() : async Int {
    let now_ns = Time.now();
    let now_sec = now_ns / 1_000_000_000;
    let weekFromNow = now_sec + 604800;
    return weekFromNow;
  };

  public func getAllCampaignStatus() : async [Text] {
    let currentTime = Time.now() / 1_000_000_000; // Convert nanoseconds to seconds
    let campaignStatuses = Array.map<Campaign, Text>(campaigns, func(c) {
      if (c.isClosed) {
        "Campaign '" # c.title # "' is closed."
      } else if (currentTime > c.deadline) {
        "Campaign '" # c.title # "' has reached its deadline."
      } else {
        "Campaign '" # c.title # "' is still open."
      }
    });
    return campaignStatuses;
  };

  public query func checkCampaignStatus(campaignId: Nat) : async Text {
    let campaignOpt = findCampaign(campaignId);
    switch (campaignOpt) {
      case (null) { return "Campaign not found"; };
      case (?campaign) {
        if (campaign.isClosed) {
          return "Campaign '" # campaign.title # "' is closed.";
        } else {
          return "Campaign '" # campaign.title # "' is still open.";
        }
      }
    }
  };

};
