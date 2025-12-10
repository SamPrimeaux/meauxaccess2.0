// Southern Pets Animal Rescue - Adoption Form HTML Generator
// Generates the complete adoption form HTML

export function generateAdoptionFormHTML(): string {
  return `
    <style>
        .adoption-form-section { 
            margin-bottom: 2.5rem; 
            padding-bottom: 2rem; 
            border-bottom: 1px solid #e5e7eb; 
        }
        .adoption-form-section:last-child { 
            border-bottom: none; 
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .adoption-form-section h3 { 
            font-size: 1.375rem; 
            font-weight: 700; 
            color: #1a1a1a; 
            margin-bottom: 1.25rem; 
            padding-bottom: 0.75rem; 
            border-bottom: 3px solid #2ecc71; 
        }
        .adoption-form-section p { 
            color: #666; 
            font-size: 0.9375rem; 
            margin-bottom: 1.25rem; 
            line-height: 1.7; 
        }
        .form-group { 
            margin-bottom: 1.5rem; 
        }
        .form-group label { 
            display: block; 
            font-weight: 600; 
            color: #374151; 
            margin-bottom: 0.625rem; 
            font-size: 0.9375rem; 
            line-height: 1.5;
        }
        .form-group label .required { 
            color: #ef4444; 
            margin-left: 3px;
            font-weight: 700;
        }
        .form-group input, 
        .form-group select, 
        .form-group textarea { 
            width: 100%; 
            padding: 0.9375rem 1.125rem; 
            border: 2px solid #d1d5db; 
            border-radius: 0.625rem; 
            font-size: 1rem; 
            font-family: inherit;
            line-height: 1.5;
            transition: all 0.25s ease;
            -webkit-appearance: none;
            appearance: none;
            background-color: #ffffff;
            box-sizing: border-box;
            min-height: 48px;
        }
        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus { 
            outline: none; 
            border-color: #2ecc71; 
            box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.12); 
            background-color: #ffffff;
        }
        .form-group textarea { 
            min-height: 100px; 
            resize: vertical; 
            padding-top: 0.9375rem;
        }
        .form-row { 
            display: grid; 
            grid-template-columns: 1fr; 
            gap: 1rem; 
        }
        .checkbox-group { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 1.25rem; 
            margin-top: 0.5rem;
        }
        .checkbox-item { 
            display: flex; 
            align-items: center; 
            gap: 0.625rem; 
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        .checkbox-item input[type="checkbox"] { 
            width: 1.25rem; 
            height: 1.25rem;
            min-width: 1.25rem;
            min-height: 1.25rem;
            cursor: pointer;
            accent-color: #2ecc71;
        }
        .checkbox-item label {
            margin: 0;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9375rem;
        }
        .form-info { 
            background: #f3f4f6; 
            padding: 1.25rem; 
            border-radius: 0.625rem; 
            margin-bottom: 1.5rem; 
            font-size: 0.9375rem; 
            color: #4b5563; 
            line-height: 1.7;
            border-left: 4px solid #2ecc71;
        }
        .form-actions { 
            display: flex; 
            flex-direction: column;
            gap: 0.875rem;
            margin-top: 2.5rem; 
            padding-top: 1.75rem; 
            border-top: 2px solid #e5e7eb; 
            background: #ffffff;
            padding-bottom: 1rem;
        }
        .btn-submit { 
            width: 100%;
            background: #2ecc71; 
            color: white; 
            padding: 1.125rem 1.75rem; 
            border: none; 
            border-radius: 0.625rem; 
            font-weight: 700; 
            font-size: 1.0625rem;
            cursor: pointer; 
            transition: all 0.25s ease; 
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.25);
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            min-height: 52px;
        }
        .btn-submit:hover { 
            background: #27ae60; 
            box-shadow: 0 6px 16px rgba(46, 204, 113, 0.35);
            transform: translateY(-2px);
        }
        .btn-submit:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
        }
        .btn-submit:disabled { 
            background: #9ca3af; 
            cursor: not-allowed; 
            transform: none;
            box-shadow: none;
        }
        .btn-cancel { 
            width: 100%;
            padding: 1.125rem 1.75rem; 
            border: 2px solid #d1d5db; 
            background: white; 
            border-radius: 0.625rem; 
            font-weight: 600; 
            font-size: 1.0625rem;
            cursor: pointer; 
            transition: all 0.25s ease;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            min-height: 52px;
            color: #374151;
        }
        .btn-cancel:hover {
            background: #f9fafb;
            border-color: #9ca3af;
        }
        .btn-cancel:active {
            background: #f3f4f6;
            transform: scale(0.98);
        }
        .hidden { 
            display: none !important; 
        }
        #adoption-success, 
        #adoption-error { 
            padding: 1.125rem 1.25rem; 
            border-radius: 0.625rem; 
            margin-bottom: 1.5rem; 
            line-height: 1.6;
            font-size: 0.9375rem;
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        #adoption-success { 
            background: #d1fae5; 
            color: #065f46; 
            border: 2px solid #6ee7b7; 
        }
        #adoption-error { 
            background: #fee2e2; 
            color: #991b1b; 
            border: 2px solid #fca5a5; 
        }
        @media (min-width: 640px) {
            .form-row { 
                grid-template-columns: 1fr 1fr; 
            }
            .form-actions {
                flex-direction: row;
                gap: 1rem;
            }
            .btn-submit,
            .btn-cancel {
                width: auto;
            }
            .btn-cancel {
                flex: 0 0 auto;
                min-width: 120px;
            }
            .btn-submit {
                flex: 1;
            }
        }
        @supports (-webkit-touch-callout: none) {
            .form-group input,
            .form-group select,
            .form-group textarea {
                font-size: 16px;
            }
        }
        @media (max-width: 480px) {
            .adoption-form-section {
                margin-bottom: 2rem;
                padding-bottom: 1.5rem;
            }
            .adoption-form-section h3 {
                font-size: 1.25rem;
            }
            .form-group {
                margin-bottom: 1.25rem;
            }
            .form-actions {
                margin-top: 2rem;
                padding-top: 1.5rem;
            }
        }
    </style>
    <form id="adoption-form" onsubmit="submitAdoptionForm(event)">
        <div id="adoption-success" class="hidden">
            <p><strong>Success!</strong> Your adoption application has been submitted. We'll contact you soon!</p>
        </div>
        <div id="adoption-error" class="hidden">
            <p><strong>Error:</strong> <span id="error-message"></span></p>
        </div>

        <!-- Introduction -->
        <div class="adoption-form-section">
            <p><strong>Southern Pets Animal Rescue (aka SPAR)</strong> is a rescue organization for homeless animals. It is our goal to place these animals in permanent, loving homes where every member of the household is committed to their lifelong care. If you are willing to take on such a responsibility, please complete the application below.</p>
            
            <div class="form-info">
                <strong>Adoption Requirements:</strong><br>
                • You must be 21 or have the consent of your legal guardian. Proof will be required.<br>
                • You must be willing to allow a representative of SPAR to make a virtual home visit, follow-up visit in person, or by phone. Random visits may be made anytime within the first 60 days of adoption.<br>
                • You must pay the standard adoption fee at time of adoption approval and retrieval of the animal.<br>
                • You must provide the name and phone number of your veterinarian and make a visit within the first 30 days of adoption. If you currently do not have a veterinarian, you will need to establish one within this timeframe.
            </div>
        </div>

        <!-- Personal Information -->
        <div class="adoption-form-section">
            <h3>Personal Information</h3>
            <p>Thank you for your interest in adopting a pet from Southern Pets Animal Rescue. Please fill out the form below to start the adoption process.</p>
            
            <div class="form-group">
                <label>What pet are you interested in adopting? <span class="required">*</span></label>
                <input type="text" name="interested_pet" id="interested_pet" required placeholder="e.g., Gloria the Black Lab">
            </div>

            <div class="form-group">
                <label>Full Name <span class="required">*</span></label>
                <div class="form-row">
                    <input type="text" name="first_name" id="first_name" required placeholder="First Name">
                    <input type="text" name="last_name" id="last_name" required placeholder="Last Name">
                </div>
            </div>

            <div class="form-group">
                <label>Birthday</label>
                <input type="date" name="birthday" id="birthday">
            </div>

            <div class="form-group">
                <label>Name of Employer and Employer's Phone Number</label>
                <input type="text" name="employer_name" id="employer_name" placeholder="Employer Name">
                <input type="tel" name="employer_phone" id="employer_phone" placeholder="Employer Phone" style="margin-top: 0.5rem;">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Phone Number <span class="required">*</span></label>
                    <input type="tel" name="applicant_phone" id="applicant_phone" required placeholder="(000) 000-0000">
                </div>
                <div class="form-group">
                    <label>Email Address <span class="required">*</span></label>
                    <input type="email" name="applicant_email" id="applicant_email" required placeholder="example@example.com">
                </div>
            </div>
        </div>

        <!-- Housing and Living Arrangements -->
        <div class="adoption-form-section">
            <h3>Housing and Living Arrangements</h3>
            
            <div class="form-group">
                <label>Address <span class="required">*</span></label>
                <input type="text" name="street_address" id="street_address" required placeholder="Street Address">
                <input type="text" name="street_address_2" id="street_address_2" placeholder="Street Address Line 2" style="margin-top: 0.5rem;">
                <div class="form-row" style="margin-top: 0.5rem;">
                    <input type="text" name="city" id="city" required placeholder="City">
                    <input type="text" name="state" id="state" required placeholder="State / Province">
                    <input type="text" name="zip_code" id="zip_code" required placeholder="Postal / Zip Code">
                </div>
            </div>

            <div class="form-group">
                <label>Do you own or rent your home? <span class="required">*</span></label>
                <select name="home_ownership" id="home_ownership" required>
                    <option value="">Select...</option>
                    <option value="own">Own</option>
                    <option value="rent">Rent</option>
                </select>
            </div>

            <div class="form-group">
                <label>Is your yard securely fenced? <span class="required">*</span></label>
                <select name="yard_fenced" id="yard_fenced" required>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="partial">Partially</option>
                </select>
            </div>

            <div class="form-group">
                <label>Are pets allowed in your home? Is there a pet deposit and is it paid? <span class="required">*</span></label>
                <textarea name="pets_allowed" id="pets_allowed" required></textarea>
            </div>

            <div class="form-group">
                <label>How long have you lived at your current address? <span class="required">*</span></label>
                <input type="text" name="residence_length" id="residence_length" required placeholder="e.g., 2 years">
            </div>

            <div class="form-group">
                <label>Where will the animal primarily live? <span class="required">*</span></label>
                <select name="animal_living_location" id="animal_living_location" required>
                    <option value="">Select...</option>
                    <option value="indoors">Indoors</option>
                    <option value="outdoors">Outdoors</option>
                    <option value="both">Both</option>
                </select>
            </div>

            <div class="form-group">
                <label>If you move in the future to a place where animals are NOT allowed, what would happen to the animal? <span class="required">*</span></label>
                <textarea name="move_plan" id="move_plan" required></textarea>
            </div>

            <div class="form-group">
                <label>How many adults and children live in your home? <span class="required">*</span></label>
                <input type="text" name="household_size" id="household_size" required placeholder="e.g., 2 adults, 1 child">
            </div>

            <div class="form-group">
                <label>Please list the ages of each child living in your home.</label>
                <input type="text" name="children_ages" id="children_ages" placeholder="e.g., 5, 8, 12">
            </div>

            <div class="form-group">
                <label>How many hours a day will the animal be left alone each day? <span class="required">*</span></label>
                <input type="text" name="alone_hours" id="alone_hours" required placeholder="e.g., 4 hours">
            </div>

            <div class="form-group">
                <label>Who will be responsible for feeding, grooming, vet care, etc? <span class="required">*</span></label>
                <textarea name="care_responsibility" id="care_responsibility" required></textarea>
            </div>

            <div class="form-group">
                <label>Is everyone living in your home committed to caring for a pet? <span class="required">*</span></label>
                <select name="household_committed" id="household_committed" required>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div class="form-group">
                <label>Does anyone in your home have allergies? <span class="required">*</span></label>
                <select name="allergies" id="allergies" required>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div class="form-group">
                <label>What role will the animal play in your life? Check all that apply. <span class="required">*</span></label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" name="animal_role" id="role_companion" value="companion">
                        <label for="role_companion">Companion</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="animal_role" id="role_guard" value="guard">
                        <label for="role_guard">Guard Dog</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="animal_role" id="role_working" value="working">
                        <label for="role_working">Working Animal</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="animal_role" id="role_other" value="other">
                        <label for="role_other">Other</label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>What is the activity level in your home? <span class="required">*</span></label>
                <select name="activity_level" id="activity_level" required>
                    <option value="">Select...</option>
                    <option value="very_active">Very Active</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                </select>
            </div>
        </div>

        <!-- Animal Behavior Issues and Cost -->
        <div class="adoption-form-section">
            <h3>Animal Behavior Issues and Cost</h3>
            
            <div class="form-group">
                <label>Adopted animals (especially puppies and kittens) are likely to have some potty accidents in their new home for a short time. How will you handle this? <span class="required">*</span></label>
                <textarea name="potty_accidents_plan" id="potty_accidents_plan" required></textarea>
            </div>

            <div class="form-group">
                <label>Which of the following behaviors would you NOT be able to live with? Check all that apply. <span class="required">*</span></label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" name="unacceptable_behaviors" id="behavior_barking" value="excessive_barking">
                        <label for="behavior_barking">Excessive Barking</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="unacceptable_behaviors" id="behavior_chewing" value="destructive_chewing">
                        <label for="behavior_chewing">Destructive Chewing</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="unacceptable_behaviors" id="behavior_jumping" value="jumping">
                        <label for="behavior_jumping">Jumping</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="unacceptable_behaviors" id="behavior_aggression" value="aggression">
                        <label for="behavior_aggression">Aggression</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="unacceptable_behaviors" id="behavior_separation" value="separation_anxiety">
                        <label for="behavior_separation">Separation Anxiety</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="unacceptable_behaviors" id="behavior_none" value="none">
                        <label for="behavior_none">None - I can work with any behavior</label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>If the animal has any of these behaviors, how will you handle it? <span class="required">*</span></label>
                <textarea name="behavior_handling" id="behavior_handling" required></textarea>
            </div>

            <div class="form-group">
                <label>Estimated budget for monthly flea, tick, and heartworm preventatives: <span class="required">*</span></label>
                <input type="text" name="monthly_preventative_budget" id="monthly_preventative_budget" required placeholder="e.g., $50">
            </div>

            <div class="form-group">
                <label>Estimated budget for annual vet visits: <span class="required">*</span></label>
                <input type="text" name="annual_vet_budget" id="annual_vet_budget" required placeholder="e.g., $500">
            </div>

            <div class="form-group">
                <label>Have you ever taken an animal to an animal shelter or animal control? If so, why? <span class="required">*</span></label>
                <textarea name="shelter_history" id="shelter_history" required></textarea>
            </div>

            <div class="form-group">
                <label>Have you ever applied to adopt from an animal shelter or rescue group? <span class="required">*</span></label>
                <select name="previous_application" id="previous_application" required>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div class="form-group">
                <label>Was your application approved? If not, please explain why.</label>
                <textarea name="previous_application_result" id="previous_application_result"></textarea>
            </div>
        </div>

        <!-- Animal History and Care -->
        <div class="adoption-form-section">
            <h3>Animal History and Care</h3>
            
            <div class="form-group">
                <label>How many dogs/cats have you had in your life? <span class="required">*</span></label>
                <input type="text" name="previous_pets_count" id="previous_pets_count" required placeholder="e.g., 3 dogs, 2 cats">
            </div>

            <div class="form-group">
                <label>Have you ever lost a dog or cat to an accident or escape in the last 5 years? If yes, what happened? <span class="required">*</span></label>
                <textarea name="lost_pet_history" id="lost_pet_history" required></textarea>
            </div>

            <div class="form-group">
                <label>Do you have any dogs or cats in your home now? <span class="required">*</span></label>
                <select name="current_pets" id="current_pets" required>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div class="form-group">
                <label>If yes, list the pets in your home below. Please include each animals (1) BREED, (2) AGE, and (3) GENDER.</label>
                <textarea name="current_pets_list" id="current_pets_list" placeholder="e.g., Golden Retriever, 5 years old, Male"></textarea>
            </div>

            <div class="form-group">
                <label>Are your pets housebroken? Who did the potty training?</label>
                <textarea name="housebreaking_info" id="housebreaking_info"></textarea>
            </div>

            <div class="form-group">
                <label>Are your pets spayed and/or neutered? If not, please explain.</label>
                <textarea name="spay_neuter_info" id="spay_neuter_info"></textarea>
            </div>

            <div class="form-group">
                <label>Are your pets up-to-date on vaccines? If not, please explain.</label>
                <textarea name="vaccine_info" id="vaccine_info"></textarea>
            </div>

            <div class="form-group">
                <label>Where do your pets live?</label>
                <select name="pets_living_location" id="pets_living_location">
                    <option value="">Select...</option>
                    <option value="indoors">Indoors</option>
                    <option value="outdoors">Outdoors</option>
                    <option value="both">Both</option>
                </select>
            </div>

            <div class="form-group">
                <label>What kind of heartworm preventative do you prefer?</label>
                <input type="text" name="heartworm_preventative" id="heartworm_preventative" placeholder="e.g., Heartgard, Sentinel">
            </div>

            <div class="form-group">
                <label>What vet do you use? Please list name of clinic, location, and phone number.</label>
                <textarea name="veterinarian_info" id="veterinarian_info" placeholder="Clinic name, location, phone number"></textarea>
            </div>
        </div>

        <!-- Certification and Agreement -->
        <div class="adoption-form-section">
            <h3>Certification and Agreement</h3>
            
            <div class="form-info">
                <strong>I certify that the information provided on this application is complete and correct to the best of my knowledge.</strong> I understand that providing false information may void this application and result in forfeiture of the adopted animal and adoption fee. I hereby authorize Southern Pets Animal Rescue to contact my veterinarian, landlord, or other party listed above for further information.
            </div>

            <div class="form-group">
                <label>Your signature here <span class="required">*</span></label>
                <input type="text" name="signature" id="signature" required placeholder="Type your full name">
            </div>

            <div class="form-info" style="margin-top: 1.5rem;">
                <strong>Agreement to Adopt</strong><br>
                By his/her signature below, adopter hereby agrees to the following terms and conditions. Please read thoroughly.<br><br>
                • Adopter acknowledges that SPAR is providing an animal for adoption on an "as is" basis. SPAR makes no representation as to the temperament or medical condition of the animal being adopted. All medical records received by SPAR are provided to adopter.<br>
                • Adopter shall have the animal established with personal veterinarian within 30 days of adoption, which will include exam and acknowledgment of previous vet history provided by SPAR to adopter.<br>
                • Adopter shall allow a representative of SPAR to visit the animal on a random basis during the first year of adoption and to notify SPAR of any change of address during this time period.<br>
                • Adopter shall provide for animal's physical and emotional needs including proper diet and nutrition, housing, exercise, medical care, vaccinations, and monthly heartworm preventative.<br>
                • Adopter agrees not to abandon, give away, sell or trade the animal for the duration of the animal's natural life.<br>
                • Adopter agrees to contact SPAR in the event that the animal must be rehomed due to unforeseeable circumstances.<br>
                • Adoption fee will not be refunded after 72 hrs. unless adopter contacts rescue within that period requesting additional time.<br>
                • Adopter agrees to make every reasonable effort to locate the animal should it escape or become lost or stolen.<br>
                • On the effective date of this adoption agreement, adopter assumes complete liability for the adopted animal.<br>
                • It is the requirement of this rescue that ALL animals adopted be spayed or neutered by 6 months of age.
            </div>

            <div class="form-group">
                <label>Please initial (if applicable) - Puppies/kittens require a series of 3 vaccines spaced 3 weeks apart.</label>
                <input type="text" name="vaccine_initial" id="vaccine_initial" placeholder="Initial here">
            </div>

            <div class="form-group">
                <label>Please initial (if applicable) - If SPAR is unable to perform a reference check prior to preliminary approval.</label>
                <input type="text" name="reference_check_initial" id="reference_check_initial" placeholder="Initial here">
            </div>

            <div class="form-group">
                <label>Please initial (if applicable) - In the event SPAR is informed of mistreatment to the adopted animal.</label>
                <input type="text" name="mistreatment_initial" id="mistreatment_initial" placeholder="Initial here">
            </div>

            <div class="form-group">
                <label>I, the undersigned adopter, have read and acknowledge the terms of this agreement. <span class="required">*</span></label>
                <input type="text" name="agreement_signature" id="agreement_signature" required placeholder="Type your full name">
            </div>

            <div class="form-info" style="margin-top: 1rem; background: #fef3c7; border: 1px solid #fbbf24;">
                <strong>I UNDERSTAND THIS APPLICATION IS NOT FORMERLY APPROVED</strong> and this contract does not become final until SPAR has performed the necessary reference checks to verify that the information provided herein is accurate. IF YOUR CURRENT PET, OR PETS, OWNED WITHIN THE LAST 5 YEARS, HAVE NOT BEEN, OR ARE NOT CURRENT ON VACCINATIONS AND MONTHLY HEARTWORM PREVENTION, YOUR APPLICATION WILL BE DENIED AND ADOPTION VOIDED.
            </div>
        </div>

        <!-- Payment -->
        <div class="adoption-form-section">
            <h3>Payment</h3>
            <div class="form-info">
                <strong>*PAYMENT DUE UPON APPROVAL OF ADOPTION*</strong><br>
                Payment is required to finalize the adoption. We will notify you as soon as possible if you have been approved.
            </div>

            <div class="form-group">
                <label>How do you plan to pay the adoption fee? ($250) <span class="required">*</span></label>
                <select name="payment_method" id="payment_method" required>
                    <option value="">Select...</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="venmo">Venmo</option>
                    <option value="cashapp">CashApp</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label>Additional support allows us to provide foster homes, food, and medical care to animals in need. Would you like to make an additional tax-deductible donation?</label>
                <input type="number" name="donation_amount" id="donation_amount" placeholder="0.00" min="0" step="0.01">
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" id="submit-adoption-btn" class="btn-submit">Submit Application</button>
            <button type="button" onclick="closeAdoptModal()" class="btn-cancel">Cancel</button>
        </div>
    </form>
    <script>
        async function submitAdoptionForm(event) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = document.getElementById('submit-adoption-btn');
            const successDiv = document.getElementById('adoption-success');
            const errorDiv = document.getElementById('adoption-error');
            const errorMessage = document.getElementById('error-message');
            
            if (successDiv) successDiv.classList.add('hidden');
            if (errorDiv) errorDiv.classList.add('hidden');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
            
            const formData = new FormData(form);
            const data = {};
            
            const animalRoles = [];
            const unacceptableBehaviors = [];
            
            formData.forEach((value, key) => {
                if (key === 'animal_role') {
                    animalRoles.push(value);
                } else if (key === 'unacceptable_behaviors') {
                    unacceptableBehaviors.push(value);
                } else {
                    data[key] = value;
                }
            });
            
            data.animal_role = animalRoles;
            data.unacceptable_behaviors = unacceptableBehaviors;
            data.animal_id = window.selectedAnimalId || null;
            data.interested_pet = document.getElementById('interested_pet')?.value || '';
            
            try {
                const response = await fetch('/api/adoption-submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    if (successDiv) successDiv.classList.remove('hidden');
                    form.reset();
                    setTimeout(() => {
                        closeAdoptModal();
                    }, 3000);
                } else {
                    if (errorDiv && errorMessage) {
                        errorMessage.textContent = result.error || 'There was an error submitting your application. Please try again or contact us at 337-581-7562.';
                        errorDiv.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                if (errorDiv && errorMessage) {
                    errorMessage.textContent = 'There was an error submitting your application. Please try again or contact us at 337-581-7562.';
                    errorDiv.classList.remove('hidden');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Application';
                }
            }
        }
        window.submitAdoptionForm = submitAdoptionForm;
    </script>
  `;
}
