use anchor_lang::prelude::*;

declare_id!("Aj2ptVm1MKuYzFSKovq78LiNTpdAZi5YxBiWB144sT29");

#[program]
pub mod payllm_sol {
    use super::*;

    pub fn record_data(
        ctx: Context<CreateRecord>,
        ai_query: String,
        ai_model: String,
        credits: u64,
        amount: u64,
        user_address: String,
        user_query: String,
    ) -> Result<()> {
        let record: &mut Account<'_, RecordState> = &mut ctx.accounts.record;
        record.user_query = user_query;
        record.ai_query = ai_query;
        record.ai_model = ai_model;
        record.credits = credits;
        record.user_address = user_address;
        record.amount = amount;

        Ok(())
    }
}

#[account]
pub struct RecordState{
    pub user_query: String,
    pub ai_query: String,
    pub ai_model: String,
    pub credits: u64,
    pub user_address: String,
    amount: u64
}

#[derive(Accounts)]
pub struct CreateRecord<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<RecordState>()
    )]
    pub record: Account<'info, RecordState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

