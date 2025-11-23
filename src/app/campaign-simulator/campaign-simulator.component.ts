import { Component, ElementRef, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-campaign-simulator",
  templateUrl: "./campaign-simulator.component.html",
  styleUrls: ["./campaign-simulator.component.scss"],
})
export class CampaignSimulatorComponent {
  isClicked: boolean = false;
  featureList: boolean = false;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    this.fetchCityState();
  }

  name: string = "";
  email: string = "";
  mobile: string = "";
  zipCode: string = "560001";
  persona: string = "Silver Level Member";
  category: string = "Fashion"; // Default category
  city = "";
  state = "";
  showPreviewPanel: boolean = false;

  features: any = {
    loyalty: false,
    location: false,
    personalizedOffers: false,
    productRecommendations: false,
    aiStylist: false,
  };

  mapUrl: SafeResourceUrl | null = null;

  tabs = [
    { id: "email", displayName: "EMAIL" },
    { id: "whatsapp", displayName: "WHATSAPP" },
    { id: "notification", displayName: "NOTIFICATION" },
    { id: "smsRcs", displayName: "SMS(RCS)" },
    { id: "sms", displayName: "SMS" },
  ];

  @ViewChild("carousel", { static: false }) carousel!: ElementRef;

  carouselProducts = [
    { discount: "23% off", img: "assets/images/carousel/c1.png" },
    { discount: "50%", img: "assets/images/carousel/c3.png" },
  ];

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -200, behavior: "smooth" });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 200, behavior: "smooth" });
  }

  selectedTab = "email";
  activeTab: string = this.tabs[0].id;

  setTab(tab: string) {
    this.activeTab = tab;
    if (!this.category) {
      this.category = "Fashion";
    }
  }

  generateCampaign(form: NgForm) {
    if (form.invalid) return;

    const formData = form.value;
    this.featureList = true;

    const allFalse = Object.values(this.features).every((value) => value === false);
    if (allFalse) {
      this.features = {
        loyalty: true,
        location: this.zipCode == ''? false : true,
        personalizedOffers: true,
        productRecommendations: true,
        aiStylist: true,
      };
    } else {
      this.features = {
        loyalty: formData.loyaltyPoints || false,
        location: formData.location || false,
        personalizedOffers: formData.personalizedOffers || false,
        productRecommendations: formData.productReco || false,
        aiStylist: formData.aiStylist || false,
      };
    }

    this.fetchCityState();

    this.name = formData.name;
    this.email = formData.email;
    this.mobile = formData.mobile;
    this.zipCode = formData.zipCode;
    this.persona = formData.persona;
    this.category = formData.category;
    this.showPreviewPanel = true;
    
    console.log("Form Data:", formData);
    // You can trigger your preview logic here as before
  }

  fetchCityState() {
    if (!this.zipCode) return;

    /* this.http.get<any>(`https://api.zippopotam.us/us/${this.zipCode}`).subscribe({
      next: (data) => {
        if (data && data.places && data.places.length) {
          this.city = data.places[0]['place name'];
          this.state = data.places[0]['state'];
        } else {
          alert('Invalid ZIP code');
          this.city = '';
          this.state = '';
        }
      },
      error: () => {
        alert('ZIP code not found');
        this.city = '';
        this.state = '';
      }
    }); */

    // Using free Zippopotam.us API
    this.http.get(`https://api.postalpincode.in/pincode/${this.zipCode}`).subscribe({
      next: (data: any) => {
        const place = data[0].PostOffice[0];
        this.city = place.District;
        this.state = place.State;

        // Free Google Maps Embed (no key required)
        this.mapUrl = `https://www.google.com/maps?q=${this.zipCode}&output=embed`;
      },
      error: () => {
        this.city = "";
        this.state = "";
        this.mapUrl = "";
        alert("Invalid ZIP code or data not found");
      },
    });
  }

  isAnyFeatureSelected(): boolean {
    return Object.values(this.features).some((value) => value === true);
  }

  isGrocerySelected(): boolean {
    return this.category === "Grocery";
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
