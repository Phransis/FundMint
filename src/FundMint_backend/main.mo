import Time "mo:base/Time";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

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
  };

  type Milestone = {
    // id : Nat;
    // campaign : Campaign;
    title : Text;
    description : Text;
    target : Int;
    // raised : Int;
    deadline : Time.Time;
    isReleased : Bool;
    // contributors : [Principal];
  };

  type Contribution = {
    id : Int;
    campaign : Campaign;
    contributor : Principal;
    amount : Nat;
    timestamp : Time.Time;
    refund : Bool;
  };

  // type User = {
  //   id : Int;
  //   address : Principal;
  //   name : Text;
  //   email : Text;
  //   campaigns : [Campaign];
  // };

  // var campaignId : Nat = 0;
  // var milestoneId : Nat = 0;
  var  campaigns : [Campaign] = [];
  var contributuions : [Contribution] = [];

 public shared(msg) func createCampaign(title: Text, description: Text, target: Nat, deadline: Time.Time,  milestones: [Milestone]) : async Text {
  let owner = msg.caller;
    let newCampaign : Campaign = {
      id = Array.size(campaigns) +1; 
      owner = owner;
      title = title;
      description = description;
      target = target;
      raised = 0;
      deadline = deadline;
      contributors = [];
      milestones = milestones;
      isClosed = false;
    };
    campaigns := Array.append<Campaign>(campaigns, [newCampaign]);
    // owner.campaigns := Array.append<Campaign>(owner.campaigns, [newCampaign]);
    return "Your " #newCampaign.title # " campaign was created successfully";
  };

  public shared(msg) func updateCampaign(campaignId : Nat, title: Text, description: Text, target: Nat, deadline: Time.Time, milestones: [Milestone]) {
    if (campaignId < 1 or campaignId > Array.size(campaigns) ) {
      throw Error.reject("Campaign not found");
    };
    let campaign = campaigns[campaignId - 1];
    let updatedCampaign = { 
      id = campaign.id; 
      owner = campaign.owner; 
      title = title; 
      description = description; 
      target = target; 
      raised = campaign.raised; 
      deadline = deadline; 
      contributors = campaign.contributors; 
      milestones = milestones; 
      isClosed = campaign.isClosed 
    };
    campaigns := Array.tabulate<Campaign>(campaigns.size(), func(i) {
      if (campaigns[i].id == campaign.id) { updatedCampaign } else { campaigns[i] }
    });
  };

  public shared(msg) func contribute(campaignId: Nat, amount: Nat) {
    if (campaignId < 1 or campaignId > Array.size(campaigns)) {
      throw Error.reject("Campaign not found");
    };
    let campaign = campaigns[campaignId - 1];
    let user = msg.caller;
    let contribution : Contribution = {
      id = Array.size(contributuions) + 1;
      campaign = campaign;
      contributor = user;
      amount = amount;
      timestamp = Time.now();
      refund = false;
    };
    contributuions := Array.append<Contribution>(contributuions, [contribution]);

    // let updatedCampaign = { 
    //   id = campaign.id; 
    //   name = campaign.title; 
    //   description = campaign.description; 
    //   target = campaign.target; 
    //   raised = campaign.raised + amount; 
    //   deadline = campaign.deadline; 
    //   owner = campaign.owner; 
    //   contributors = Array.append(campaign.contributors, [user]) 
    // };
    // campaigns := Array.tabulate<Campaign>(campaigns.size(), func(i) {
    //   if (campaigns[i].id == campaign.id) { campaigns[i] } else { campaigns[i] }
    // });
  };

  public query func getCampaigns() : async [Campaign] {
    return campaigns;
  };
  public shared(msg) func getCaller() : async Principal {
    return msg.caller;
  };

  public query func getCampaignById(campaignId: Nat) : async Campaign {
    return campaigns[campaignId];
  };


  public query func getContributors(campaignId: Nat) : async [Principal] {
    return campaigns[campaignId].contributors;
  };

  public query func getContributorsCount(campaignId: Nat) : async Int {
    return campaigns[campaignId].contributors.size();
  };

  public query func getContributions(campaignId: Nat) : async Int {
    return campaigns[campaignId].raised;
  };

  public query func getTarget(campaignId: Nat) : async Int {
    return campaigns[campaignId].target;
  };

  public query func getDeadline(campaignId: Nat) : async Time.Time {
    return campaigns[campaignId].deadline;
  };

  public query func getOwner(campaignId: Nat) : async Principal {
    return campaigns[campaignId].owner;
  };

  public query func getOwnerCampaigns(owner: Principal) :async [Campaign] {
    return Array.filter<Campaign>(campaigns, func(campaign) { campaign.owner == owner });
  };
};

//   public func getOwnerName(campaign: Campaign) : async Text {
//     return campaign.owner.name;
//   };

//   public func getOwnerEmail(campaign: Campaign) : async Text {
//     return campaign.owner.email;
//   };

//   public func getOwnerCampaigns(owner: User) : async [Campaign] {
//     return owner.campaigns;
//   };

  // public func getOwnerCampaignsCount(owner: User) : async Int {
  //   return owner.campaigns.size();
  // };

//   // public func getOwnerName(owner: User) : Text {
//   //   return owner.name;
//   // };
//   public func getUserCampaigns(user: User) : async [Campaign] {
//     return user.campaigns;
//   };

//   public func getUserById(id: Int) : async User {
//     for (campaign in campaigns.vals()) {
//       if (campaign.owner.id == id) {
//         return campaign.owner;
//       };
//     };
//     // Handle case where user is not found
//     throw Error.reject("User not found");
//   };

